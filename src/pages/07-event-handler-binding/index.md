---
title: 'Considerations When Passing Class Methods to Event Handlers'
date: '2019-03-06'
---

<div id="img-container">
<img id="chain-img" src="./images/chain.jpg">
<div class="src-container"><span class="source">Photo by Stephen Hickman on Unsplash</span></div>
</div>

I spent hours digging into the details of event handlers this week, namely how best to initialize and destroy them within class methods.

In the process, a conversation erupted on Twitter related to my problem.

The tweet that started it all:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">So... you need a &quot;hard this-bound&quot; method to pass in, like:<br><br>  btn.addEventListener(&quot;click&quot;,x.someMethod.bind(x));<br><br>Or... you can define an arrow function wrapper:<br><br>  btn.addEventListneer(&quot;click&quot;,() =&gt; x.someMethod());</p>&mdash; getify (@getify) <a href="https://twitter.com/getify/status/1102606261462413312?ref_src=twsrc%5Etfw">March 4, 2019</a></blockquote>

The entire thread is worth reading (you can read it by clicking the tweet above). In short, it describes the two common techniques for hard-binding class methods, and the issues that arise as a result.

_Option 1: using .bind(this)_:

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

_Option 2: using an arrow function_:

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

All this chatter begs the question: Why is binding necessary anyway? Did the creators of JavaScript miss something?

The answer, like everything in development, is complicated.

### Why is _this_ Necessary?

At the root of the issue is the question of what _this_ actually refers to in JavaScript.

Per the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this" target="_blank">MDN documentation</a>:

_the 'this' keyword refers to the context object in which the current code is executed._

Let's dig deeper with an example. If _this_ is being referenced outside of an object, like so:

```javascript
console.log(this)
```

... it'll be equal to either _window_ or _undefined_, depending on whether you're running in strict mode (_undefined_ in strict mode).

The value of _this_ changes when it's referenced within a context object. To demonstrate, here's a simple example of _this_ use in a class:

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

In this example, _this_ refers to the _sound_ field on the class instance, or puppy.

But what if, in our offensively contrived example, we wanted our puppy to bark whenever someone knocked on the door?

```javascript
let door = document.createElement('p')
let content = document.createTextNode('🚪')
door.appendChild(content)
document.body.appendChild(door)

door.addEventListener('knock', puppy.bark)

door.dispatchEvent(new CustomEvent('knock'), {}) // undefined
```

Now, when we pass our class method to the event handler, its context was lost 😱.

This is because the _addEventListener_ method accepts the function as its callback and executes it on its own terms, in the global object implementing the Web API.

Which brings us back to the techniques mentioned earlier for resolving this issue.

### Two Solutions, in Detail

To solve this problem, we have two options: using _.bind(this)_ or an arrow function.

_Option One: .bind(this):_

```javascript
class Dog {
  sound = 'woof'
  boundBark = this.bark.bind(this)
  bark() {
    console.log(this.sound)
  }
}

let puppy = new Dog()
let door = document.createElement('p')
let content = document.createTextNode('🚪')
door.appendChild(content)
document.body.appendChild(door)

door.addEventListener('knock', puppy.boundBark)

door.dispatchEvent(new CustomEvent('knock'), {}) // 'woof'
```

With our bound function passed, we hear our familiar sound again.

To explain how this works, we once again return to <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind" target="_blank">the MDN documentation</a>:

_The .bind() method creates a new function that, when called, has its this keyword set to the provided value._

When we bound our _this_ to the bark method and passed it to the event handler, it was guaranteeing that we'd still be referring to _Dog_ when the method was called later.

_Option Two: arrow function:_

```javascript
class Dog {
  sound = 'woof'
  boundBark = () => this.bark()
  bark() {
    console.log(this.sound)
  }
}

let puppy = new Dog()
let door = document.createElement('p')
let content = document.createTextNode('🚪')
door.appendChild(content)
document.body.appendChild(door)

door.addEventListener('knock', puppy.boundBark)

door.dispatchEvent(new CustomEvent('knock'), {}) // 'woof'
```

With the advent of arrow functions, retaining context in class methods became much easier. Because the functions have no _this_ context, the value is derived from the enclosing execution context, which is our _Dog_ class.

Now that we have two techniques for solving this problem, it's time to pick one to implement.

### Which Should I Use?

For some, the question is a matter of preference.

What _matters_, they argue, is that you understand why you're binding at all, which problem it's solving, and the alternative approaches to weigh among your team.

Then again, there's <a href="https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1" target="_blank">a growing sense</a> that arrow functions have their drawbacks.

The main arguments against arrow functions for binding equate to:

_Reason No. 1:_ because they're just anonymous function expressions, they're technically _properties_ on the class instance, meaning they're not added to the class prototype. They also can't make use of _super_.

_Reason No. 2:_ because the function is not a part of the object prototype, it's mockability is compromised and changes won't be detected.

_Reason No. 3:_ historically, arrow functions had a <a href="https://jsperf.com/arrow-function-vs-bind-vs-context-argument/6" target="_blannk">greater performance cost</a>.

Although there's still overhead associated with creating separate dedicated 'bound' functions, I ultimately chose to explicitly _.bind()_ my class methods.

### Further Resources

If you'd like to read more into _this_ and arrow functions or using _.bind(this)_, the following resources might be helpful:

- Kyle Simpson (tweet author from above) and his excellent 'You Don't Know JS' Series, specifically <a href="https://github.com/getify/You-Dont-Know-JS/blob/master/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes" target="_blank">'_this_ & Object Prototypes'</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind" target="_blank">Mozilla Docs for .bind()</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this" target="_blank">Mozilla Docs for _this_</a>

As always, thanks for reading!
