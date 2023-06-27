There's still a weird extra newline getting generated in the for loop.

I think as annoying as it is you actually shouldn't strip leading whitespace
when rendering out exprs. Markdown is whitespace-sensitive, as are other
languages like YAML, so you'll break things if you do.

You should have a test for first-line-after-frontmatter, so that shebangs can
still come after frontmatter.
