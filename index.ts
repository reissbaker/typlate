import { Command } from "@commander-js/extra-typings";
import * as fs from "fs/promises";

const program = new Command("compile")
  .option("--outdir <dir>")
  .argument("<path>")
  .action(async (path, opts) => {
    await compile(path, opts);
  });

type Opts = ReturnType<typeof program.opts>;

async function compile(path: string, opts: Opts) {
  const realpath = await fs.realpath(path);
  const dirinfo = await fs.stat(realpath);

  if(dirinfo.isDirectory()) return compileDir(path, opts);
  if(dirinfo.isFile()) return compileFile(path, opts);

  throw `${realpath} is neither a file nor a directory`;
}

async function compileFile(path: string, opts: Opts) {
  const contents = await fs.readFile(path, { encoding: 'utf-8' });
  const ts = toTypescript(contents);
}

async function compileDir(path: string, opts: Opts) {
  throw `unimplemented`
}

const RUN_REGEX = /<%([^%>]*)%>/;
function toTypescript(contents: string) {
  let start = 0;
  const head: string[] = [];
  const segments: string[] = [];
  let args: string[] = [];

  for(const match of contents.matchAll(RUN_REGEX)) {
    const [fullString, captureGroup] = match;
    const plainText = contents.substring(0, match.index);
    segments.push(encodePlainText(plainText));
    if(captureGroup.startsWith("--")) {
      head.push(encodeRun(captureGroup.substring(2)));
    }
    else if(captureGroup[0] === "=") {
      segments.push(printExpr(captureGroup.substring(1)));
    }
    else {
      segments.push(encodeRun(captureGroup));
    }
    start += fullString.length;
  }

  return head.join("\n") + "\n" + wrapFn(segments);
}

const printFn = `print`;

function wrapFn(segments: string[]) {
  return `export default function render(args: Args) {
  const __typlate_segments: string[] = [];
  const ${printFn} = (str: string) => __typlate_segments.push(str);

  ${segments.join("\n")}
  return __typlate_segments.join("");
}`;
}

function encodePlainText(text: string) {
  return `${printFn}(${JSON.stringify(text)});`;
}

function encodeRun(text: string) {
  return text;
}

function printExpr(text: string) {
  return `${printFn}(${text});`;
}
