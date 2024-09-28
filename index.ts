import { visit } from "unist-util-visit";
import { type Root } from "hast";

/**
 * A rehype plugin to extend blockquote syntax to make it simple to mention/cite sources in a semantically correct way.
 * More info: [https://github.com/nikitarevenco/remark-semantic-blockquotes](https://github.com/nikitarevenco/remark-semantic-blockquotes)
 */
const rehypeSemanticBlockquotes = (
  /**
   * Configuration for the plugin
   */
  opts = {
    /**
     * Attribute name for the `<figure>` element
     */
    figure: "data-blockquote-container",
    /**
     * Attribute name for the `<blockquote>` element
     */
    blockquote: "data-blockquote-content",
    /**
     * Attribute name for the `<figcaption>` element
     */
    figcaption: "data-blockquote-credit",
    /**
     * Syntax to use to trigger the plugin's effect
     */
    syntax: "@ ",
  }
) => {
  return (tree: Root) => {
    /** @ts-ignore */
    const isMdx = tree.children?.[0]?.type === "mdxjsEsm";

    visit(tree, "element", (blockquote, index, parent) => {
      if (!parent || !index) {
        return;
      }

      if (blockquote.tagName === "blockquote") {
        // If there are 4 or less children, then do nothing, because we require a minimum of 2 elements to proceed
        // e.g. with 2 elements `blockquote` would have this structure: [\n, ${element1}, \n, ${element2}, \n]
        if (blockquote.children.length <= 4) {
          return;
        }

        // the last child will always be a newline, so take the one before
        /** @ts-ignore */
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

export default rehypeSemanticBlockquotes
