---
title: 'How Websites Happen, Part Two: Optimizing Performance'
date: '2019-02-10'
---

<div id="img-container">
<img id="knowledge-img" src="./images/optimize-v2.jpg">
<div class="src-container"><span class="source">Photo by Denisse Leon on Unsplash</span></div>
</div>

In the <a href="/05-treading-critical-rendering" target="_blank">previous post</a>, I walked through the details of the critical rendering path. It explained the process an HTML file goes through from being received by the browser all the way to its visualization on the page.

For the second half of this topic, I'll focus on ways developers can reduce the time and cost associated with these steps, making for a more performant, enjoyable user experience as a result.

To better illustrate the ideas expressed, I'll walk through creating a simple SPA in vanilla JavaScript.

You can see the demo app <a href="https://vanilla-site-dzmkgredfp.now.sh/page-one" target="_blank">here</a>, or <a href="https://github.com/alephnode/vanilla-spa" target="_blank">view/clone the source on GitHub</a> and [skip the next section](#module-bundler) if you're here only for the performance tips.

Alright, let's get started!

### Building the Site

Before we can optimize the performance of a site, we need a site 😃. Luckily, I've prepared a basic project for us to work with.

The <a href="https://github.com/alephnode/vanilla-spa" target="_blank">repository</a> for this project provides two examples: one basic site, and the same site optimized. Because the project is relatively straightforward (mostly web component declarations), I'll only walk through the core modules before explaining the optimization steps.

The first module we'll look at is the base class from which all components, pages, and core app logic is derived. _Note: all examples from the first section will be taken from the /basic directory, if you're following along with the source code._

_./basic/src/base/index.js:_

```javascript
import { render } from '/node_modules/lit-html/lit-html.js'

class Base extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this._render()
    this.onMount()
  }

  updateTpl() {
    this._render()
  }

  disconnectedCallback() {
    this.onUnmount()
  }

  dispatch(event, detail) {
    this.dispatchEvent(
      new CustomEvent(event, { detail, bubbles: true, composed: true })
    )
  }

  getChild(qry) {
    return this.shadowRoot.querySelector(qry)
  }

  getChildren(qry) {
    return this.shadowRoot.querySelectorAll(qry)
  }

  _render() {
    render(this.tpl(), this.shadowRoot)
  }

  /*abstract*/ onMount() {}
  /*abstract*/ onUnmount() {}
  /*abstract*/ tpl() {}
}

export default Base
```

If you're familiar with web components, much of the above should look familiar to you. If not, I'm effectively writing a few wrapper methods to offer more semantic names for lifecycle methods extended from HTMLElement. I also pull in the only dependency in the project, _lit-html_, to render content to the page.

If you haven't checked it out yet, _lit-html_ is a lightweight, intuitive library from the Polymer team that makes templating a breeze. It also just hit its first stable release, so it's worth taking a look.

Now that we've seen the base class used across the project, let's take a look at the main app module:

_./src/app.js:_

```javascript
import { html } from '/node_modules/lit-html/lit-html.js'
import { unsafeHTML } from '/node_modules/lit-html/directives/unsafe-html.js'
import Base from './base/index.js'
import registerComponent from './common/register-component/index.js'
import routes from './common/routes/index.js'
import './components/v-router/index.js'
import './pages/page-one/index.js'
import './pages/page-two/index.js'

class VApp extends Base {
  constructor() {
    super()
    this.navigate = this.navigate.bind(this)
  }

  onMount() {
    let page = location.pathname.substr(1)
    this.setActivePage((page && this.isRegistered(page)) || 'v-page-one')
    this.shadowRoot
      .querySelector('#root')
      .addEventListener('nav-changed', ({ detail: { route } }) =>
        this.navigate(route)
      )
  }

  navigate(route) {
    this.setActivePage(route)
  }

  setActivePage(page) {
    if (!page) return
    const pageTag = `<${page}></${page}>`
    this.htmlToRender = html`
      ${unsafeHTML(pageTag)}
    `
    history.pushState({}, page, page.split('v-')[1])
    this.updateTpl()
  }

  isRegistered(page) {
    return routes.indexOf(`v-${page}`) > -1 ? `v-${page}` : false
  }

  tpl() {
    return this.htmlToRender
      ? html`
          <style>
            #root {
              max-width: 1200px;
              margin: 0 auto;
            }
          </style>
          <div id="root">
            <v-router></v-router>
            ${this.htmlToRender}
          </div>
        `
      : ``
  }
}

registerComponent('v-app', VApp)
```

The app module's primary concern is maintaining control of the application's viewport, namely which page is currently being displayed. Whenever a new page is requested, the module checks to see if it has a corresponding component to render for that route. If not, it defaults to displaying the homepage.

The final line of the file (and every file with a web component declaration in the project) takes care of the custom element's registration:

_./src/common/register-component/index.js:_

```javascript
export default (txt, className) => {
  if (customElements.get(txt)) return
  const register = () => customElements.define(txt, className)
  window.WebComponents ? window.WebComponents.waitFor(register) : register()
}
```

Although it's exciting to build apps almost entirely in JavaScript with web components, it _does_ come with some performance costs. A closer look at the "network" tab in Chrome's developer tools offers insight into this idea:

<div id="img-container">
<img id="knowledge-img" src="./images/perf-test-basic.png">
<div class="src-container"><span class="source">Photo by Denisse Leon on Unsplash</span></div>
</div>

As you can see (click the image to expand if needed), simply loading the page in the browser resulted in almost 40 resource requests from the browser. This high number of trips resulted in a page load speed of close to 700ms, which is pretty poor considering how little content is on the page.

Upon closer inspection, we can see that all those _index.js_ references are my web component declarations--many of which aren't even used on the first page. No good!

In order to get this app in better shape, let's take a look at a few of the optimization techniques available.

### <div id="module-bundler">Module Bundler</div>

If you've made it this far, you've either seen the skeleton of the example application or have a general idea of the issue at hand: building a site using mostly JavaScript while keeping the browser's requests light and as few as possible.

One of the most powerful tools available to help us accomplish this task is a <b>module bundler</b>. In short, it enables us to package all our app logic together in one file to minimize the number of requests needed to render our app.

A popular option that's the darling of the JavaScript community is Webpack.

For this application, I'll use Parcel sinze it's zero configuration makes adding it to your application effortless.

### Code Splitting

### Tree Shaking

### Service Worker

### Manifest.json, a11y
