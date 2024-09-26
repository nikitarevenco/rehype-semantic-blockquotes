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
export default function rehypeSemanticBlockquotes(opts?: {
    figure: string;
    blockquote: string;
    figcaption: string;
    syntax: string;
}): import("hast").Root;
//# sourceMappingURL=index.d.ts.map