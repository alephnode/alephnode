---
title: 'Considerations When Passing Class Methods to Event Handlers'
date: '2019-03-06'
---

<div id="img-container">
<img id="chain-img" src="./images/chain.jpg">
<div class="src-container"><span class="source">Photo by Stephen Hickman on Unsplash</span></div>
</div>

A conversation erupted on Twitter the other day that related directly to what I'd been investigating for work: how best to initialize and destroy event handlers in class methods.

The key point:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">So... you need a &quot;hard this-bound&quot; method to pass in, like:<br><br>  btn.addEventListener(&quot;click&quot;,x.someMethod.bind(x));<br><br>Or... you can define an arrow function wrapper:<br><br>  btn.addEventListneer(&quot;click&quot;,() =&gt; x.someMethod());</p>&mdash; getify (@getify) <a href="https://twitter.com/getify/status/1102606261462413312?ref_src=twsrc%5Etfw">March 4, 2019</a></blockquote>

The entire thread is worth reading (you can read it by clicking the tweet above). In short, The two main options for binding class methods are:

_manually binding a class method_:

```javascript
class Bar extends Foo {
  constructor() {
    super()
    this.boundHandleClick = this.handleClick.bind(this)
  }
  connectedCallback() {
    this.addEventListener('click', this.boundHandleClick)
  }
  handleClick(e) {
    console.log(`I was clicked: ${e}`)
  }
}
```

_lexical 'this' binding with arrow function_:

```javascript
class Baz extends Foo {
  constructor() {
    super()
    this.boundHandleClick = e => console.log(`I was clicked: ${e}`)
  }
  connectedCallback() {
    this.addEventListener('click', this.boundHandleClick)
  }
}
```

So, which method is best for handling events? The answer, like so many in development, is complicated.

### Why is this Necessary?

Before going into the details of both options, it's important to emphasize why this problem exists in the first place.

Without binding, we no longer have a context object. When we pass the function to the event listener method, its context is the global object--either _window_ or _undefined_, depending on whether strict mode is enabled.

### Two Approaches, in Details

### Which Should I Use?

We've seen examples where both options offer the expected result. So which should you use? The truth is: it doesn't matter. What matters is that you understand why you're binding in the first place, what problem its solving, and how the decision impacts performance.
