import { toMarkdown } from "mdast-util-to-markdown";
import { visit } from "unist-util-visit";

/**
 * Wraps some content and a caption inside of a HTML figure
 */
const wrapWithHtml = (content, caption, opts) => {
  return `
<figure ${opts.figure}>
  <blockquote ${opts.blockquote}>
    ${content}
  </blockquote>
  <figcaption ${opts.figcaption}>
    ${caption}
  </figcaption>
</figure>
`;
};

/**
 * Convert list of markdown nodes to a single markdown file
 */
const mdAstListToMd = (mdAst) =>
  mdAst.reduce((mdFile, node) => {
    const asMarkdown = toMarkdown(node);
    const withoutNewlines = asMarkdown.slice(0, -1);
    return mdFile.concat(withoutNewlines);
  }, "");

const checkLastChild = (caption) => {
  if (caption[0].value.startsWith("@ ")) {
    caption[0].value = caption[0].value.slice(2);
  }
  if (caption.value === "") {
    caption.shift();
  }
};

/**
 * @typedef {import('./File1.js').MyObject1} MyObject1
 */
const parse = (blockquote, opts) => {
  // would not make sense to transform if there is only 1 child
  if (blockquote.children.length >= 2) {
    const lastChild = blockquote.children.at(-1);
    if (lastChild.type !== "paragraph") {
      throw new Error("Expected paragraph, but got:", lastChild.type);
    }
    const content = blockquote.children.slice(0, -1);
    const caption = lastChild.children;

    checkLastChild(caption);

    const contentMd = mdAstListToMd(content);
    const captionMd = mdAstListToMd(caption);
    const html = wrapWithHtml(contentMd, captionMd, opts);

    // replace markdown syntax with the modified HTML
    blockquote.type = "html";
    blockquote.children = undefined;
    blockquote.value = html;
  }
};

/**
 * Extends markdown syntax of blockquotes, making them more semantic by using figure and figcaption elements when giving credit
 * @param {{ figure: string, blockquote: string, figcaption: string }} opts Change the default attributes passed to the <figure>, <blockquote> and <figcaption> elements
 */
const remarkSemanticBlockquote = (
  opts = {
    figure: 'data-blockquote-figure=""',
    blockquote: 'data-blockquote-content=""',
    figcaption: 'data-blockquote-figcaption=""',
  },
) => {
  return (tree) => {
    /**
     * @param {string} blockquote
     */
    visit(tree, "blockquote", (blockquote) => parse(blockquote, opts));
  };
};

export default remarkSemanticBlockquote;
