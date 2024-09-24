# Remark Semantic Blockquotes

### TLDR

Extends markdown blockquote syntax to allow for mention of author or origin

Transforms the following:

```md
> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ [Josh Davis](https://somewhere.com)
```

Into this:

```md
<figure data-blockquote-figure="">
  <blockquote data-blockquote-content="">
    Better to admit you walked through the wrong door than spend your life in the wrong room.
  </blockquote>
  <figcaption data-blockquote-figcaption="">
    [Josh Davis](https://somewhere.com)
  </figcaption>
</figure>
```

See more examples in [test.js](./test.js)

The attributes (`data-blockquote-figure`, etc.) are fully customizable. The plugin takes a parameter, `opts` with the following default config:

```js
{
  figure: 'data-blockquote-figure=""',
  blockquote: 'data-blockquote-content=""',
  figcaption: 'data-blockquote-figcaption=""',
};
```

### Explanation

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

But that is _semantically incorrect_! [A `<cite>` element should refer to _work_](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite#usage_notes) and not _people_. (e.g. twitter post, book, article)

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
<p>&mdash; Albert Einstein</p>
```

If we want to style them together we would have to wrap them within a parent element.

But there is a different approach, using the `<figure>` element we can create a more semantic version.

This plugin does just that.

Then we can easily style the blockquote and the caption however we want to using CSS

```css
[data-blockquote-figure] {
  display: flex;
  flex-direction: column;
  flex-gap: 8px;
}
[data-blockquote-figcaption]::before {
  content: "&mdash; ";
}
```

### Syntax Info

In the MD blockquote, if the last line starts with an `@` and the line before is an empty line then the transformation will take place. Otherwise we will just get a regular `<blockquote>`, the plugin won't take effect.

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
