import remarkParse from "remark-parse";
import remarkSemanticBlockquote from "./index.js";
import { remark } from "remark";
import test from "node:test";
import assert from "node:assert";

const tests = [
  [
    "Will do nothing if there is no linebreak between the credit and the content",
    `> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
> @ Albert Einstein
`,
    `> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
> @ Albert Einstein
`,
  ],
  [
    "Will not transform markdown link",
    `> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
>
> @ [Albert Einstein](hahahaa)
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    [Albert Einstein](hahahaa)
  </figcaption>
</figure>
`,
  ],
  [
    "Will not transform complicated markdown syntax with several nodes",
    `
> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
>
> @ Credit: [Albert Einstein](https://www.goodreads.com/author/quotes/9810.Albert_Einstein), we obtained the quotes at **some website**
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    Credit: [Albert Einstein](https://www.goodreads.com/author/quotes/9810.Albert_Einstein), we obtained the quotes at **some website**
  </figcaption>
</figure>
`,
  ],
];

tests.forEach(async ([message, input, expected]) => {
  const file = await remark()
    .use(remarkParse)
    .use(remarkSemanticBlockquote)
    .process(input);

  test(message, () => {
    assert.strictEqual(String(file), expected);
  });
});
