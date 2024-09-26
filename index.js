import { visit } from "unist-util-visit";

/**
 * A rehype plugin to extend blockquote syntax to make it simple to mention/cite sources in a semantically correct way.
 * More info: [https://github.com/nikitarevenco/remark-semantic-blockquotes](https://github.com/nikitarevenco/remark-semantic-blockquotes)
 *
 * @param {Object} opts Configuration for the plugin
 * @param {string} opts.figure Attribute name for the `<figure>` element
 * @param {string} opts.blockquote Attribute name for the `<blockquote>` element
 * @param {string} opts.figcaption Attribute name for the `<figcaption>` element
 * @param {string} opts.syntax Syntax to use to trigger the plugin's effect
 * @returns {import("hast").Root} The transformed HAST root node
 */
export default function rehypeSemanticBlockquotes(
  opts = {
    figure: "data-blockquote-contaienr",
    blockquote: "data-blockquote-content",
    figcaption: "data-blockquote-credit",
    syntax: "@ ",
  },
) {
  return (tree) => {
    const isMdx = tree.children?.[0]?.type === "mdxjsEsm";

    visit(tree, "element", (blockquote, index, parent) => {
      if (blockquote.tagName === "blockquote") {
        // If there are 4 or less children, then do nothing, because we require a minimum of 2 elements to proceed
        // e.g. with 2 elements `blockquote` would have this structure: [\n, ${element1}, \n, ${element2}, \n]
        if (blockquote.children.length <= 4) {
          return;
        }

        // the last child will always be a newline, so take the one before
        const credit = blockquote.children.at(-2);

        /**
         * The candidate node that we check for starting with the correct syntax
         */
        const textNodeWithSyntax = credit.children.at(0);

        const startsWithCorrectSyntax = textNodeWithSyntax.value.startsWith(
          opts.syntax,
        );

        if (!startsWithCorrectSyntax) {
          return;
        }

        textNodeWithSyntax.value = textNodeWithSyntax.value.slice(
          opts.syntax.length,
        );

        const content = blockquote.children.slice(0, -2);

        const type = isMdx ? "mdxJsxFlowElement" : "element";
        const name = isMdx ? "name" : "tagName";
        const attributes = isMdx ? "attributes" : "properties";

        const ast = {
          type,
          [name]: "figure",
          [attributes]: isMdx
            ? [
              {
                type: "mdxJsxAttribute",
                name: opts.figure,
                value: "",
              },
            ]
            : {
              [opts.figure]: "",
            },
          children: [
            {
              type,
              [name]: "blockquote",
              [attributes]: isMdx
                ? [
                  {
                    type: "mdxJsxAttribute",
                    name: opts.blockquote,
                    value: "",
                  },
                ]
                : {
                  [opts.blockquote]: "",
                },
              children: content,
            },
            {
              type,
              [name]: "figcaption",
              [attributes]: isMdx
                ? [
                  {
                    type: "mdxJsxAttribute",
                    name: opts.figcaption,
                    value: "",
                  },
                ]
                : {
                  [opts.figcaption]: "",
                },
              children: [credit],
            },
          ],
        };

        parent.children[index] = ast;
      }
    });
  };
}
