import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { remark } from "remark";

const doc = `
> hello, world!
> @me

> yet, again!
> @another

> this time, yes!
> 
> @ok
`;

await remark()
  .use(remarkParse)
  .use((opts) => {
    return (tree, _file) => {
      visit(tree, "blockquote", (node) => {
        const lastChild = node.children.at(-1);
        visit(lastChild, "text", (node) => {
          if (node.value.startsWith("@")) {
            console.log("yes!");
          }
        });
      });
    };
  })
  .process(doc);

// console.error(String(file));
