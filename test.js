import remarkParse from "remark-parse";
import remarkSemanticBlockquote from "./index.js";
import { remark } from "remark";
import test from "node:test";
import assert from "node:assert";

const tests = [
  [
    "Will do nothing if there is no linebreak between the credit and the content",
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
> @ Josh Davis
`,
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
> @ Josh Davis
`,
  ],
  [
    "Will not transform markdown link",
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ [Josh Davis](https://somewhere.com)
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Better to admit you walked through the wrong door than spend your life in the wrong room.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    [Josh Davis](https://somewhere.com)
  </figcaption>
</figure>
`,
  ],
  [
    "Will not transform complicated markdown syntax with several nodes",
    `
> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ Credit: [Josh Davis](https://www.somewhere.com), we obtained the quote at **some website**
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Better to admit you walked through the wrong door than spend your life in the wrong room.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    Credit: [Josh Davis](https://www.somewhere.com), we obtained the quote at **some website**
  </figcaption>
</figure>
`,
  ],
  [
    "Will transform a multi-line blockquote with a caption",
    `
> Better to admit you walked through the wrong door
> than spend your life in the wrong room.
>
> @ Josh Davis
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Better to admit you walked through the wrong door
than spend your life in the wrong room.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    Josh Davis
  </figcaption>
</figure>
`,
  ],
  [
    "Will transform a blockquote with a nested list in the content",
    `
> Here are some steps:
>
> 1. Do this
> 2. Then do that
> 3. Finally, do the other thing
>
> @ Jane Doe
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Here are some steps:

1. Do this
2. Then do that
3. Finally, do the other thing
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    Jane Doe
  </figcaption>
</figure>
`,
  ],
  [
    "Will transform a blockquote with inline code in the content",
    `
> Use the \`console.log()\` function to debug your code.
>
> @ John Doe
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Use the \`console.log()\` function to debug your code.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    John Doe
  </figcaption>
</figure>
`,
  ],
];

tests.forEach(async ([message, input, expected], index) => {
  const file = await remark()
    .use(remarkParse)
    .use(remarkSemanticBlockquote)
    .process(input);

  test(message, () => {
    assert.strictEqual(String(file), expected);
  });
});
