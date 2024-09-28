import { visit } from "unist-util-visit";
import { whitespace } from 'hast-util-whitespace'
import type { Root } from "hast";

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

    visit(tree, 'element', (blockquote, index, parent) => {
      if (!parent || index === undefined || blockquote.tagName !== "blockquote") {
        return;
      }

      let tailIndex = blockquote.children.length - 1

      while (tailIndex > -1 && whitespace(blockquote.children[tailIndex])) {
        tailIndex--
      }

      const tail = blockquote.children[tailIndex]

      if (!tail || tail.type !== 'element' || tail.tagName !== 'p') { 
        return 
      }

      // Depends what you want with `> *@* this`, `> @ *this*`, `> *@ this*`.
      // Tail must be a `p`.
      const tailText = tail.children[0]

      if (tailText.type !== 'text' || !tailText.value.startsWith(opts.syntax)) {
        return
      }

      tailText.value = tailText.value.slice(opts.syntax.length)

      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { [opts.figure]: '' },
        children: [
          {
            type: 'element',
            tagName: 'blockquote',
            properties: { [opts.blockquote]: '' },
            children: blockquote.children.slice(0, tailIndex)
          },
          {
            type: 'element',
            tagName: 'figcaption',
            properties: { [opts.figcaption]: '' },
            children: [
              {
                type: 'element',
                tagName: 'p',
                properties: {},
                children: tail.children
              }
            ]
          }
        ]
      }
    })
  };
}

export default rehypeSemanticBlockquotes
