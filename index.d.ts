/**
 * A rehype plugin to extend blockquote syntax to make it simple to mention/cite sources in a semantically correct way.
 *
 * More info: [https://github.com/nikitarevenco/remark-semantic-blockquotes](https://github.com/nikitarevenco/remark-semantic-blockquotes)
 */
export default function rehypeSemanticBlockquotes(options: {
  /**
   * Attribute name for the <figure> element, default: "data-blockquote-container"
   */
  figure?: string;
  /**
   * Attribute name for the <blockquote> element, default: "data-blockquote-content"
   */
  blockquote?: string;
  /**
   * Attribute name for the <figcaption> element, default: "data-blockquote-credit"
   */
  figcaption?: string;
  /**
   * Syntax to use to have the plugin's effect take place, default: "@ "
   */
  syntax?: string;
}): (tree: Root) => undefined;

export type Root = import("hast").Root;
