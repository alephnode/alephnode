---
title: 'Considerations When Passing Class Methods to Event Handlers'
date: '2019-03-06'
---

<div id="img-container">
<img id="chain-img" src="./images/chain.jpg">
<div class="src-container"><span class="source">Photo by Stephen Hickman on Unsplash</span></div>
</div>

A conversation erupted on Twitter the other day that related directly to what I'd been investigating for work: how best to initialize and destroy event handlers in class methods.

The tweet that started it all:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">So... you need a &quot;hard this-bound&quot; method to pass in, like:<br><br>  btn.addEventListener(&quot;click&quot;,x.someMethod.bind(x));<br><br>Or... you can define an arrow function wrapper:<br><br>  btn.addEventListneer(&quot;click&quot;,() =&gt; x.someMethod());</p>&mdash; getify (@getify) <a href="https://twitter.com/getify/status/1102606261462413312?ref_src=twsrc%5Etfw">March 4, 2019</a></blockquote>

The entire thread is worth reading (you can read it by clicking the tweet above). In short, the two main options for binding class methods are:

_manually binding a class method_:

```javascript
class Bar extends Foo {
  constructor() {
    super()
    // here's the manual bind
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
    // here's the lexical bind
    this.boundHandleClick = e => console.log(`I was clicked: ${e}`)
  }
  connectedCallback() {
    this.addEventListener('click', this.boundHandleClick)
  }
}
```

So, which technique is best for handling events within a class? The answer, like so many in development, is complicated.

### Why is this Necessary?

Before going into the details of both options, it's important to emphasize why this problem exists.

Here's a simple example of predictable _this_ usage in a class:

```javascript
class Dog {
  sound = 'woof'
  bark() {
    console.log(this.sound)
  }
}
let puppy = new Dog()
puppy.bark() // woof
```

As expected, the _this_ keyword refers to the _sound_ field on the class instance.

But, in an offensively contrived example, what if we wanted our puppy to bark whenever someone knocked on the door?

```javascript
let door = document.createElement('p')
let content = document.createTextNode('🚪')
door.appendChild(content)
document.body.appendChild(door)

door.addEventListener('knock', puppy.bark)

door.dispatchEvent(new CustomEvent('knock'), {}) // undefined
```

What happened?

Without binding, we no longer have a context object. When we pass the function to the event listener method, its context is the global object--either _window_ or _undefined_, depending on whether strict mode is enabled.

### Two Approaches, in Detail

To solve this problem, we have the two options summarized above: using _.bind(this)_ or an arrow function.

### Which Should I Use?

We've seen examples where both options offer the expected result. So which should you use?

The truth is: the question is misguided. What _matters_ is that you understand why you're binding at all, which problem it's solving, alternative approaches, and how the decision impacts performance.
