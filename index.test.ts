import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeParse from "rehype-parse";
import { unified } from "unified";
import rehypeSemanticBlockquotes from "./index.ts";

import test from "node:test";
import assert from "node:assert";

const markdownTests = [
  [
    "Do nothing if there is no linebreak between the credit and the content",
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
> @ Josh Davis
`,
    `<blockquote>
<p>Better to admit you walked through the wrong door than spend your life in the wrong room.
@ Josh Davis</p>
</blockquote>`,
  ],
  [
    "Does not transform markdown link",
    `> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ [Josh Davis](https://somewhere.com)
`,
    `<figure data-blockquote-container=""><blockquote data-blockquote-content="">
<p>Better to admit you walked through the wrong door than spend your life in the wrong room.</p>
</blockquote><figcaption data-blockquote-credit=""><p><a href="https://somewhere.com">Josh Davis</a></p></figcaption></figure>`,
  ],
  [
    "Does not transform complicated markdown syntax with reveral nodes",
    `
> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ Credit: [Josh Davis](https://www.somewhere.com), we obtained the quote at **some website**
`,
    `<figure data-blockquote-container=""><blockquote data-blockquote-content="">
<p>Better to admit you walked through the wrong door than spend your life in the wrong room.</p>
</blockquote><figcaption data-blockquote-credit=""><p>Credit: <a href="https://www.somewhere.com">Josh Davis</a>, we obtained the quote at <strong>some website</strong></p></figcaption></figure>`,
  ],
  [
    "Transforms a multi-line blockquote with a caption",
    `
> Better to admit you walked through the wrong door
> than spend your life in the wrong room.
>
> @ Josh Davis
`,
    `<figure data-blockquote-container=""><blockquote data-blockquote-content="">
<p>Better to admit you walked through the wrong door
than spend your life in the wrong room.</p>
</blockquote><figcaption data-blockquote-credit=""><p>Josh Davis</p></figcaption></figure>`,
  ],
  [
    "Transforms a blockquote with a nested list in the content",
    `
> Here are some steps:
>
> 1. Do this
> 2. Then do that
> 3. Finally, do the other thing
>
> @ Jane Doe
`,
    `<figure data-blockquote-container=""><blockquote data-blockquote-content="">
<p>Here are some steps:</p>
<ol>
<li>Do this</li>
<li>Then do that</li>
<li>Finally, do the other thing</li>
</ol>
</blockquote><figcaption data-blockquote-credit=""><p>Jane Doe</p></figcaption></figure>`,
  ],
  [
    "Transforms a blockquote with inline code in the content",
    `
> Use the \`console.log()\` function to debug your code.
>
> @ John Doe
`,
    `<figure data-blockquote-container=""><blockquote data-blockquote-content="">
<p>Use the <code>console.log()</code> function to debug your code.</p>
</blockquote><figcaption data-blockquote-credit=""><p>John Doe</p></figcaption></figure>`,
  ],
];

const htmlTests = [
  [
    "Transforms a simple HTML blockquote with credit",
    `<blockquote><p>Simple quote.</p><p>@ Author Name</p></blockquote>`,
    `<html><head></head><body><figure data-blockquote-container=""><blockquote data-blockquote-content=""><p>Simple quote.</p></blockquote><figcaption data-blockquote-credit=""><p>Author Name</p></figcaption></figure></body></html>`
  ],
  [
    "Handles minified HTML",
    `<blockquote><p>Minified quote.</p><p>@ Author</p></blockquote>`,
    `<html><head></head><body><figure data-blockquote-container=""><blockquote data-blockquote-content=""><p>Minified quote.</p></blockquote><figcaption data-blockquote-credit=""><p>Author</p></figcaption></figure></body></html>`
  ],
  [
    "Handles nested elements in blockquote",
    `<blockquote><p>Quote with <em>emphasis</em> and <strong>strong</strong>.</p><p>@ Author</p></blockquote>`,
    `<html><head></head><body><figure data-blockquote-container=""><blockquote data-blockquote-content=""><p>Quote with <em>emphasis</em> and <strong>strong</strong>.</p></blockquote><figcaption data-blockquote-credit=""><p>Author</p></figcaption></figure></body></html>`
  ],
  [
    "Does not transform when credit syntax is not at the end",
    `<blockquote><p>@ Not at the end.</p><p>This should not transform.</p></blockquote>`,
    `<html><head></head><body><blockquote><p>@ Not at the end.</p><p>This should not transform.</p></blockquote></body></html>`
  ],
  [
    "Handles multiple paragraphs in blockquote",
    `<blockquote><p>First paragraph.</p><p>Second paragraph.</p><p>@ Author</p></blockquote>`,
    `<html><head></head><body><figure data-blockquote-container=""><blockquote data-blockquote-content=""><p>First paragraph.</p><p>Second paragraph.</p></blockquote><figcaption data-blockquote-credit=""><p>Author</p></figcaption></figure></body></html>`
  ],
  [
    "Preserves whitespace in credit",
    `<blockquote><p>Quote.</p><p>@   Author with spaces   </p></blockquote>`,
    `<html><head></head><body><figure data-blockquote-container=""><blockquote data-blockquote-content=""><p>Quote.</p></blockquote><figcaption data-blockquote-credit=""><p>  Author with spaces   </p></figcaption></figure></body></html>`
  ]
];

markdownTests.forEach(async ([message, input, expected]) => {
  const actual = String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSemanticBlockquotes)
      .use(rehypeStringify)
      .process(input),
  );

  test(`MD -> HTML: ${message}`, () => {
    assert.strictEqual(actual, expected);
  });
});

htmlTests.forEach(async ([message, input, expected]) => {
  const actual = String(
    await unified()
      .use(rehypeParse)
      .use(rehypeSemanticBlockquotes)
      .use(rehypeStringify)
      .process(input)
  );

  test(`HTML: ${message}`, () => {
    assert.strictEqual(actual, expected);
  });
});
