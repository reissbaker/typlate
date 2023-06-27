A simple templating language that generates typesafe TypeScript.

## Getting started

```bash
npm install -g typlate

# Compile templates in ./template-dir, and put the generated code in ./generated
typlate --outdir ./generated ./template-dir
```

## Guide

Typlate lets you use ERB-style templating to generate typesafe TypeScript. You
can import the generated code into your existing TypeScript codebase, and
ensure that your templates are 1:1 in sync with your code: you can't forget to
pass in a variable at runtime, since TypeScript will check your templates at
compile-time.

For example:

```markdown
<%--
  // This is the head block, similar to YAML frontmatter. It will always go at
  // the top of the file, so define your arguments + any imports here

  // You always need to define your template args in an Args type
  type Args = {
    listingName: string,
    description: string,
    dollars: number,
    cents: number,
  };
%>

# <%= args.listingName %>

<%= args.description %>

Book for only $<%= args.dollars %>.<%= args.cents %>!
```

As you can see, `<%= ... %>` tags print out the values of expressions in the
template, just like ERB files.

### Statements

If you need to do more than just print out variables, you can use `<% ... %>`
blocks, which accept statements, and don't by themselves print anything. For
example:

```
<%--
  type Args = {
    lines: string[]
  };
%>

Here are some lines of code:

<% for(const line of lines) { %>
  <%= line %>
<% } %>
```

You can use these for `if` statements as well: it's just ordinary TypeScript.
For example:

```markdown
<%--
  type Args = {
    count: number,
  };
%>

Here's FizzBuzz up to <%= args.count %>:

<%
  function fizzbuzz(i: number) {
    const els = [];
    if(i % 3 === 0) els.push("fizz");
    if(i % 5 === 0) els.push("buzz");
    if(els.length === 0) els.push(i);
    return els.join("");
  }

  for(let i = 0; i < args.count; i++) { %>
    <%= fizzbuzz(i) %>
<% } %>
```

### Importing into TypeScript

First, make sure you've compiled the templates by running the `typlate`
command. Then:

```typescript
import render from "./path/to/generated/code";

render({
  // ...
});
```

### Partials

Since templates simply compile to functions, and you can write arbitrary
TypeScript in your templates, just import the partials and call them as
functions. We've added a special `TyplateArgs` type to infer the arguments of
an imported template, so you can easily reuse them without re-typing:

```markdown
<%--
  import linesOfCode from "./lines-of-code.md";

  type Args = {
    examples: Array<{
      name: string,
      args: TyplateArgs<typeof linesOfCode>,
    }>
  }
%>

# Coding examples:

<% for(const example of args.examples) { %>
## <%= example.name %>
<%= linesOfCode(example.args) %>
<% } %>
```
