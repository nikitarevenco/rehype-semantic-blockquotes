# rehype-semantic-blockquotes

A **[rehype][]** plugin to extend blockquote syntax to make it simple to mention/cite sources in a semantically correct way.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Security](#security)
- [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to extend blockquote syntax to allow simple citation/mention of source from which the quote originates conforming to semantic HTML standards

## When should I use this?

This project is useful if you want to have a simple syntax for citations in your blockquotes.

In markdown we can create blockquotes such as:

```md
> We cannot solve our problems with the same thinking we used when we created them.
```

But often times, it may be desireable to include a reference to the person that mentioned that quote.
We could use the `<cite>` element:

```md
> We cannot solve our problems with the same thinking we used when we created them.
> -- <cite>Albert Einstein</cite>
```

But that is _semantically incorrect_! [A `<cite>` element should refer to _work_](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite#usage_notes) and not _people_. (e.g. instagram post, book, article)

Additionally, putting a `<cite>` element within a `<blockquote>` is [forbidden by the HTML spec](https://www.w3.org/TR/html5-author/the-blockquote-element.html#the-blockquote-element) because it would make the citation a part of the quote.

So another solution could be something like this:

```md
> We cannot solve our problems with the same thinking we used when we created them.

-- Albert Einstein
```

But that feels wrong, because it would render in the following way:

```html
<blockquote>
  <p>
    We cannot solve our problems with the same thinking we used when we created
    them.
  </p>
</blockquote>
<p>-- Albert Einstein</p>
```

If we want to style them together we would have to wrap them within a parent element.

But there is a different approach, using the `<figure>` element we can create a more semantic version.

This plugin does just that.

Then we can easily style the blockquote and the caption however we want to using CSS

```css
[data-blockquote-container] {
  display: flex;
  flex-direction: column;
  flex-gap: 8px;
}
[data-blockquote-credit]::before {
  content: "- ";
}
```

## Install

This package is [ESM only][esm]. In Node.js (version 16+), install with [npm][]:

```
npm install rehype-semantic-blockquotes
```

## Use

Say we have the following file `example.js`:

```js
import rehypeFormat from "rehype-format";
import rehypeSemanticBlockquotes from "rehype-semantic-blockquotes";
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
    .use(rehypeFormat) // for demonstration purposes only
    .process(doc),
);

console.log(file);
```

...then running `node example.js` yields:

```html
<figure data-blockquote-contaienr="">
  <blockquote data-blockquote-content="">
    <p>
      Better to admit you walked through the wrong door than spend your life in
      the wrong room.
    </p>
  </blockquote>
  <figcaption data-blockquote-credit="">
    <p><a href="https://somewhere.com">Josh Davis</a></p>
  </figcaption>
</figure>
```

## API

This package exports no identifiers. The default export is `rehypeSemanticBlockquotes`.

#### `unified().use(rehypeSemanticBlockquotes)`

Adds syntax `@ ` which places the contents in the `@ ` into the `<figcaption>` element

###### Parameters

The attributes (`data-blockquote-figure`, etc.) are fully customizable. The plugin takes a parameter, `opts` with the following defaults:

```js
{
    figure: "data-blockquote-contaienr",
    blockquote: "data-blockquote-content",
    figcaption: "data-blockquote-credit",
    syntax: "@ ",
};
```

###### Returns

Transform ([`Transformer`][unified-transformer]).

#### Syntax Info

In the MD blockquote, if the last line starts with an `@ ` and the line before is an empty line then the transformation will take place. Otherwise we will just get a regular `<blockquote>`, the plugin won't take effect.

For example these snippets will not be affected by the plugin:

```md
> We cannot solve our problems with the same thinking we used when we created them.
```

```md
> We cannot solve our problems with the same thinking we used when we created them.
> @ Albert Einstein
```

But this would:

```md
> We cannot solve our problems with the same thinking we used when we created them.
>
> @ Albert Einstein
```

## Security

Use of `rehype-semantic-blockquotes` does not involve **[rehype][]** (**[hast][]**) or user
content so there are no openings for [cross-site scripting (XSS)][wiki-xss]
attacks.

## License

[MIT][license] © Nikita Revenco

[npm]: https://docs.npmjs.com/cli/install
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[license]: license
[hast]: https://github.com/syntax-tree/hast
[rehype]: https://github.com/rehypejs/rehype
[remark]: https://github.com/remarkjs/remark
[unified]: https://github.com/unifiedjs/unified
[unified-transformer]: https://github.com/unifiedjs/unified#transformer
[wiki-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
[api-remark-unlink]: #unifieduseremarkvideos
