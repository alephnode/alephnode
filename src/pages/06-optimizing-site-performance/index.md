---
title: 'How Websites Happen, Part Two: Optimizing Performance'
date: '2019-02-10'
---

In the <a href="/05-treading-critical-rendering" target="_blank">previous post</a>, I walked through the details of the critical rendering path. It explained the process an HTML file goes through from being received by the browser all the way to its visualization on the page.

For the second half of this topic, I'll focus on ways developers can reduce the time and cost associated with these steps, making for a more performant, enjoyable user experience as a result.

To better illustrate the ideas expressed, I'll walk through creating a simple SPA in vanilla JavaScript.

You can see the demo app here, or view/clone the source on GitHub and skip the next section if you're here only for the performance tips.

Alright, let's get started!

### Building the Site

Before we can optimize the performance of a site, we need a site (!). Luckily, I've prepared a basic project for us to work with.

When we're finished, the project directory will look like this:

```
.
├── index.html
├── package.json
├── src
│   ├── app.js
│   ├── base
│   │   └── index.js
│   ├── common
│   │   ├── register-component
│   │   │   └── index.js
│   │   ├── routes
│   │   │   └── index.js
│   │   └── styles.css
│   ├── components
│   │   ├── v-container
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── v-graph
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── v-headline
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── v-img-container
│   │   │   └── index.js
│   │   ├── v-link
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── v-logo
│   │   │   └── index.js
│   │   └── v-router
│   │       ├── index.js
│   │       └── styles.js
│   └── pages
│       ├── page-one
│       │   ├── index.js
│       │   └── styles.js
│       └── page-two
│           ├── index.js
│           └── styles.js
└── yarn.lock
```

To get started, create a new simple project by running:

```bash
  yarn init -y
```

Next, let's create the two main components for the site: the entry, or _index.html_, and where the main component will live, _app.js_.

The index file is simple enough:

_index.html_:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Vanilla Site</title>
    <link rel="stylesheet" href="src/common/styles.css" />
    <link
      href="https://fonts.googleapis.com/css?family=Playfair+Display:900"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
  </head>
  <body>
    <v-app></v-app>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

I load the polyfill for web components in the head, as well as a typeface to add some personality. I then reference the project's main module before the closing body tag.

Next, I'll create the base class that'll provide the main API I'll use in my components:

_./src/base/index.js:_

```javascript
import { render } from 'lit-html'

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

Several spots in the class should look familiar if you've ever used web components.

I also implemented a few render methods, which take advantage of the Polymer team's excellent new templating library _lit-html_. You can read more about that project <a href="https://github.com/Polymer/lit-html" target="_blank">here</a>. The team also offers a base class of its own, Lit-Element, but I don't need something that robust for this small example project.

Over in _app.js_, there's quite a bit more going on:

_app.js:_

```javascript
import { html } from 'lit-html'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
import Base from './base'
import registerComponent from './common/register-component'
import routes from './common/routes'
import './components/v-logo'
import './components/v-router'
import './pages/page-one'
import './pages/page-two'

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
          <div id="root">
            <v-logo></v-logo>
            <v-router></v-router>
            ${this.htmlToRender}
          </div>
        `
      : ``
  }
}

registerComponent('v-app', VApp)
```

The bulk of the logic in this module involves handling routing and swapping out the main view upon navigation. I also reference several components and pages I created for the project. I'll dump the code for those in a moment, but let's zoom in on the _registerComponent_ method to see what it's doing.

_./src/common/register-component/index.js:_

```javascript
export default (txt, className) =>
  (() => {
    if (customElements.get(txt)) return
    const register = () => customElements.define(txt, className)
    window.WebComponents ? window.WebComponents.waitFor(register) : register()
  })()
```

The module is an IIFE that accepts the name of my component and its associated class. It then checks if the component has already been registered, then handles creation depending on availability of the WebComponents API from the browser.

### Code Splitting

### Tree Shaking

### Service Worker

### Manifest.json, a11y
