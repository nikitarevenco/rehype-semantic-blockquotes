import rehypeFormat from "rehype-format";
import rehypeSemanticBlockquotes from "./index.js";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const doc = `
> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ [Josh Davis](https://somewhere.com) <a href="https://somewhere.com"></a>
`;

const file = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSemanticBlockquotes)
    .use(rehypeStringify)
    .use(rehypeFormat)
    .process(doc),
);

console.log(file);
