import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { remark } from "remark";

const tests = [
  [
    `
> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
> @ Albert Einstein
`,
    `
> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
> @ Albert Einstein
`,
  ],
  [
    `
> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
>
> @ [Albert Einstein](hahahaa)
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    <p>Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.<p>
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    <p>Albert Einstein<p>
  </figcaption>
</figure>
`,
  ],
  [
    `
> Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.
>
> @ Credit: [Albert Einstein](https://www.goodreads.com/author/quotes/9810.Albert_Einstein), we obtained the quotes at **some website**
`,
    `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    <p>Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.<p>
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    <p>Credit: <a href="https://www.goodreads.com/author/quotes/9810.Albert_Einstein">Albert Einstein</a>, we obtained the quotes at <strong>some website</strong></p>
  </figcaption>
</figure>
`,
  ],
];

/**
 * Wraps some content and a caption inside of a HTML figure
 * @param {string} content
 * @param {string} caption
 */
const wrapWithHtml = (content, caption) => {
  return `
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    ${content}
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    ${caption}
  </figcaption>
</figure>
`;
};

const file = await remark()
  .use(remarkParse)
  .use((opts) => {
    return (tree, _file) => {
      visit(tree, "blockquote", (blockquote) => {
        // would not make sense to transform if there is only 1 child
        if (blockquote.children.length >= 2) {
          const lastChild = blockquote.children.at(-1);
          if (lastChild.type !== "paragraph") {
            throw new Error("Expected paragraph, but got:", lastChild.type);
          }
          const content = blockquote.children.slice(0, -1);
          const caption = lastChild.children;
          if (caption[0].value.startsWith("@ ")) {
            caption[0].value = caption[0].value.slice(2);
          }
          console.log(content, caption);
        }
      });
    };
  })
  .process(tests[0][0]);

console.error(String(file));
