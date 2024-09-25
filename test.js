import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkSemanticBlockquote from "./index.js";

import test from "node:test";
import assert from "node:assert";

const tests = [
  [
    "Will do nothing if there is no linebreak between the credit and the content",
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
> @ Josh Davis
`,
    `<blockquote>
<p>Better to admit you walked through the wrong door than spend your life in the wrong room.
@ Josh Davis</p>
</blockquote>`,
  ],
  [
    "Will not transform markdown link",
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ [Josh Davis](https://somewhere.com)
`,
    `<figure data-blockquote-figure=""><blockquote data-blockquote-content="">
<p>Better to admit you walked through the wrong door than spend your life in the wrong room.</p>
</blockquote><figcaption data-blockquote-credit=""><p><a href="https://somewhere.com">Josh Davis</a></p></figcaption></figure>`,
  ],
  [
    "Will not transform complicated markdown syntax with reveral nodes",
    `
> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ Credit: [Josh Davis](https://www.somewhere.com), we obtained the quote at **some website**
`,
    `<figure data-blockquote-figure=""><blockquote data-blockquote-content="">
<p>Better to admit you walked through the wrong door than spend your life in the wrong room.</p>
</blockquote><figcaption data-blockquote-credit=""><p>Credit: <a href="https://www.somewhere.com">Josh Davis</a>, we obtained the quote at <strong>some website</strong></p></figcaption></figure>`,
  ],
  [
    "Will transform a multi-line blockquote with a caption",
    `
> Better to admit you walked through the wrong door
> than spend your life in the wrong room.
>
> @ Josh Davis
`,
    `<figure data-blockquote-figure=""><blockquote data-blockquote-content="">
<p>Better to admit you walked through the wrong door
than spend your life in the wrong room.</p>
</blockquote><figcaption data-blockquote-credit=""><p>Josh Davis</p></figcaption></figure>`,
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
    `<figure data-blockquote-figure=""><blockquote data-blockquote-content="">
<p>Here are some steps:</p>
<ol>
<li>Do this</li>
<li>Then do that</li>
<li>Finally, do the other thing</li>
</ol>
</blockquote><figcaption data-blockquote-credit=""><p>Jane Doe</p></figcaption></figure>`,
  ],
  [
    "Will transform a blockquote with inline code in the content",
    `
> Use the \`console.log()\` function to debug your code.
>
> @ John Doe
`,
    `<figure data-blockquote-figure=""><blockquote data-blockquote-content="">
<p>Use the <code>console.log()</code> function to debug your code.</p>
</blockquote><figcaption data-blockquote-credit=""><p>John Doe</p></figcaption></figure>`,
  ],
];

tests.forEach(async ([message, input, expected]) => {
  const actual = String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(remarkSemanticBlockquote)
      .use(rehypeStringify)
      .process(input),
  );

  test(message, () => {
    assert.strictEqual(actual, expected);
  });
});
