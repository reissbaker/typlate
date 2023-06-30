#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import * as fs from "fs/promises";
import * as path from "path";

const program = new Command()
  .argument("<path>")
  .option("--outdir <dir>")
  .action(async (path, opts) => {
    await compile(path, opts);
  });

type Opts = ReturnType<typeof program.opts>;

async function compile(target: string, opts: Opts) {
  const realpath = await fs.realpath(target);
  const dirinfo = await fs.stat(realpath);
  if(dirinfo.isDirectory()) {
    return compileDir(target, {
      outpath: opts.outdir || "",
    });
  }
  if(dirinfo.isFile()) {
    return compileFile(target, {
      outpath: opts.outdir ? path.join(opts.outdir, path.basename(target)) : target,
    });
  }

  throw `${realpath} is neither a file nor a directory`;
}

type CompileOpts = {
  outpath: string,
};

export async function compileFile(filepath: string, opts: CompileOpts) {
  const contents = await fs.readFile(filepath, { encoding: 'utf-8' });
  const ts = toTypescript(contents);

  await fs.mkdir(path.dirname(opts.outpath), {
    recursive: true,
  });

  await fs.writeFile(opts.outpath + ".ts", ts);
}

export async function compileDir(dirpath: string, opts: CompileOpts) {
  const files = await fs.opendir(dirpath);
  let file;
  while(file = await files.read()) {
    console.log(`Compiling ${file.name}...`);

    const outpath = path.join(opts.outpath, file.name);
    if(file.isDirectory()) {
      await compileDir(path.join(dirpath, file.name), {
        outpath,
      });
    }
    else {
      await compileFile(path.join(dirpath, file.name), {
        outpath,
      });
    }
  }
}

const genInfer = "type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;\n";

export function toTypescript(contents: string) {
  // what the fuck
  const runRegex = /(^[^\S\r\n]*)?<%((?:[^%]|%(?!>))+)%>([^\S\r\n]*\n)?/gm;

  let start = 0;
  const head: string[] = [];
  const segments: string[] = [];

  for(const match of contents.matchAll(runRegex)) {
    const [fullString, leadingWhitespace, captureGroup, trailingWhitespace] = match;

    if(match.index == null) throw "Unknown match index";
    const matchedLineStart = fullString[0] === "\n" || match.index === 0;

    // Since we match on the newline, and the start index may have progressed past the newline, we
    // need this check. If it progressed past the newline, this is all templating whitespace
    const encodePlain = start <= match.index;
    if(encodePlain) {
      const plainText = contents.substring(start, match.index);
      segments.push(encodePlainText(plainText));
    }

    const isStartOfLine = leadingWhitespace != null
                        || match.index === 0
                        || contents[match.index - 1] === "\n";

    const isEndOfLine = trailingWhitespace != null
                        || match.index + fullString.length === contents.length;
    const isEntireLine = isStartOfLine && isEndOfLine;

    function addWhitespaceIfNecessary() {
      if(!isEntireLine) {
        if(leadingWhitespace) segments.push(encodePlainText(leadingWhitespace));
        if(trailingWhitespace) segments.push(encodePlainText(trailingWhitespace));
      }
    }
    // Handle the various template tag types
    // First, head tags
    if(captureGroup.startsWith("--")) {
      addWhitespaceIfNecessary();
      head.push(encodeRun(captureGroup.substring(2)));
    }
    // Print expression tags
    else if(captureGroup[0] === "=") {
      if(leadingWhitespace) segments.push(encodePlainText(leadingWhitespace));
      segments.push(printExpr(captureGroup.substring(1)));
      if(trailingWhitespace) segments.push(encodePlainText(trailingWhitespace));
    }
    // Arbitrary TS tags
    else {
      addWhitespaceIfNecessary();
      segments.push(encodeRun(captureGroup));
    }

    // Update the indexes. If the templating is the start of the line, and there's an immediate
    // trailing newline, advance the start index to skip the trailing newline.
    start = match.index + fullString.length;
  }

  // Clean up any remaining strings
  if(start < contents.length - 1) {
    segments.push(encodePlainText(contents.substring(start)));
  }

  // Add the infer type, concat the head TS, and then wrap everything else in the render function
  return genInfer + head.join("\n") + "\n" + wrapFn(segments);
}


const printArray = "__typelate_print_segments";

function wrapFn(segments: string[]) {
  return `export default function render(args: Args) {
  const ${printArray}: string[] = [];

  ${segments.join("\n")}
  return ${printArray}.join("");
}`;
}

function encodePlainText(text: string) {
  return `${printArray}.push(${JSON.stringify(text)});`;
}

function encodeRun(text: string) {
  return text;
}

function printExpr(text: string) {
  return `${printArray}.push(\`$\{${text}\}\`);`;
}

program.parse();
