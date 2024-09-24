import remarkParse from "remark-parse";
import { remark } from "remark";

const doc = `
> hello, world!
> @me
`;

const file = await remark()
  .use(remarkParse)
  .use((opts) => {
    console.log(opts);
    return (tree, _file) => {
      console.log(tree, _file)
    }
  }, { lol: "lol" })
  .process(doc);

console.error(String(file));
