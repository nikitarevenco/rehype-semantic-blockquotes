import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { remark } from "remark";

const doc = `
> hello, world!
> @me
`;

const file = await remark()
  .use(remarkParse)
  .use(
    (opts) => {
      console.log(opts);
      return (tree, _file) => {
        visit(tree, "text", (node) => {
          console.log(node);
        });
      };
    },
    { lol: "lol" },
  )
  .process(doc);

console.error(String(file));
