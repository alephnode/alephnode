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

All this chatter begs the question: Why is this necessary? Did the creators of JS miss something? The answer, like everything in development, is complicated.

### Why is this Necessary?

Before going into the details of the two options presented above, it's important to emphasize why this problem exists.

At the root of the issue is the question of what _this_ actually refers to. Per the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this" target="_blank">MDN documentation</a>: the _this_ keyword refers to the context object in which the current code is executed.

If it's being referenced by itself, like so:

```javascript
console.log(this)
```

... you'll either get _window_ or _undefined_, depending on whether you're running in strict mode (_undefined_ is strict).

But what's this about a context object? To demonstrate, here's a simple example of predictable _this_ usage in a class:

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

But, in our offensively contrived example, what if we wanted our puppy to bark whenever someone knocked on the door?

```javascript
let door = document.createElement('p')
let content = document.createTextNode('🚪')
door.appendChild(content)
document.body.appendChild(door)

door.addEventListener('knock', puppy.bark)

door.dispatchEvent(new CustomEvent('knock'), {}) // undefined
```

Without binding, we no longer have a context object. When we pass the function to the event listener method, its context was lost 😱.

This is because the _addEventListener_ method accepts the function as its listener and executes it on its own terms, in the global object implementing the Web API.

### Two Solutions, in Detail

To solve this problem, we have the two options summarized above: using _.bind(this)_ or an arrow function.

--- explain what .bind() does ---

With the release of ESXXX in XX, retaining context in class methods became much easier with the use of <strong>arrow functions</strong>. This is because arrow functions have no _this_ bound to them, so the value is derived from the enclosing execution context of the function.

### Which Should I Use?

We've seen examples where both options offer the expected result. So which should you use?

The truth is: the question is a matter of preference. _Sorry, total non-answer_

What _matters_ is that you understand why you're binding at all, which problem it's solving, and the alternative approaches to weight among your team.

Then again, there's a growing sense that arrow functions have their drawbacks.

### Further Resources

If you'd like to read more into lexical _this_ via arrow functions or using _.bind(this)_, the following are a few helpful resources:

- Kyle Simpson (tweet author from above) and his excellent 'You Don't Know JS' Series, specifically <a href="https://github.com/getify/You-Dont-Know-JS/blob/master/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes" target="_blank">'_this_ & Object Prototypes'</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind" target="_blank">Mozilla Docs for .bind()</a>
- <a href="https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1" target="_blank">Arrow Functions in Class Properties Might Not Be As Great As We Think</a>

As always, thanks for reading!
