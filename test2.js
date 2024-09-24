import { toMarkdown } from "mdast-util-to-markdown";
import remarkParse from "remark-parse";
import { remark } from "remark";

const doc = `> Here are some steps:
>
> 1. Do this
> 2. Then do that
> 3. Finally, do the other thing
>
> @ Jane Doe
`;

const getInfo = (a) => {
  a.type === "listItem" ? a.children : a.value;
};

const file = await remark()
  .use(remarkParse)
  .use(() => {
    return (tree, file) => {
      const a = toMarkdown(tree);
      tree.children[0].children.map((child) => {
        console.log(child.children.map((kid) => kid.type === "listItem" ? kid.children[0].children[0].value : kid));
      });
      // console.log({
      //   a: a,
      //   b: String(file),
      //   c: tree.children[0].children.map((child) => {
      //     console.log(child.children.map(kid => getInfo(kid)));
      //   }),
      // });
    };
  })
  .process(doc);

file;

// console.log({ a: doc, b: String(file) });
