---
title: 'Creating a Reusable Brutalist React Component Library with Storybook'
date: '2019-01-20'
---

<div id="header-img-container">
<img id="gql-img" src="./images/storybook-logo.svg">
<div class="src-container"><span class="source"><i>source: https://storybookjs.org</i></span></div>
</div>

One of the most valuable tools when practicing component-based design is a self-documenting repository that's generic enough for use across multiple projects. DRY, as the cool kids say.

Since the last few component libraries I've built have been home-rolled, I was curious what the open-source community had to offer for launching one quickly.

After vetting a few notable candidates, I chose Storybook as my sandbox.

Why, you ask? First, it gives me a sensible layout, presentable look, and showcase of features -- saving hours of work as a result. It's also trusted by companies like airbnb, coursera, and Slack, so I know it's battle-tested.

Although I was disappointed with the lack of customizatable features available on the platform, I was able to get the hang of the "Storybook way" of documenting my components within a few short minutes and ship an online reference within a few hours ✨.

### Getting Started - Research/POA

One of the best pieces of advice I've found when crafting a component library comes from Cory House's <a href="https://www.pluralsight.com/courses/react-creating-reusable-components" target="_blank">PluralSight course</a> (paywall). In it, he describes the numerous decisions one makes when implementing a component library.

- SO MANY DECISIONS TO MAKE, EXPLAIN HERE \*

I chose a Brutalist design systen as my backdrop for three reasons:

<ol>
<li>The style essentialy submits full creative license to the designer, and</li>
<li>An MVP would be relatively quick since the elements found on most Brutalist-inspired sites are notably straightforward.</li>
<li>I like the way it looks. <i>(It's a palate cleanser of sorts.)</i></li>
</ol>

With a few major decisions out of the way, it's time to start coding.

You can view the finished project <a href="https://react-brutalist-ui.sh" target="_blank">here</a>, or check out the <a href="https://github.com/alephnode/react-brutalist-ui" target="_blank">source code on GitHub</a>.

_Note: This article assumes a basic understanding of React, Node, and Yarn workflows. Refer to their respective documentation/getting started guides if you need a refresher before continuing._

### Initializing the Project

To start, I navigate to the project directory and created a _package.json_ file. (I'm using Parcel as my bundler, so swap it out if you're using sonething different.)

_package.json:_

```javascript
{
  "name": "react-brutalist-ui",
  "version": "0.0.1",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "emotion": "^10.0.6",
    "prop-types": "^15.6.2",
    "react": "^16.7.0",
    "react-dom": "^16.7.0",
    "react-emotion": "^10.0.0"
  },
  "devDependencies": {
    "parcel-bundler": "^1.11.0",
    "@babel/core": "^7.2.2",
    "babel-loader": "^8.0.5"
  },
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html",
  }
}

```

Next, I initialized Storybook using their cli. (I'm using npx so I don't have to install globally):

```bash
λ npx -p @storybook/cli sb init
```

_Note: if you try to initialize Storybook before creating a package.json file, it'll spit an ugly error._

Storybook should detect that we're using React and initialize a bare proect for us. When the command is finished executing, you can test that everything works by running:

```bash
λ yarn storybook
```

You should see a basic template with an example button component, like so:

<img src="images/storybook-init.png">

<br/>

With Storybook properly running, it's time to build the first component.

### First Component - Simple Body Text Wrapper

My components for the library will need somewhere to live, so I'll create a _components_ folder in _./src_. Inside this folder, I'll create my first component: Graph.

_./src/components/Graph/index.js:_

```javascript
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import { testStyles } from './styles.js'

export default ({ text, css }) => <p css={{ ...testStyles, ...css }}>{text}</p>
```

This is just a simple paragraph wrapper. Let's create the styles file I imported in the Graph declaration file:

_./src/components/Graph/styles.js:_

```javascript
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export const testStyles = css`
  color: blue;
`
```

By default, Storybook looks for _\*.stories.js_ files in a _stories_ directory in the root of your project. If you'd like to change this location, modify the following line in the Storybook config:

_/.storybook/config.js:_

```javascript
import { addDecorator, configure } from '@storybook/react'
import { withOptions } from '@storybook/addon-options'
import { themes } from '@storybook/components'

addDecorator(
  withOptions({
    name: 'Theme',
    theme: {},
  })
)

// Change the next line
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
```

For more helpful resources, check out:

- <a href="https://www.learnstorybook.com/" target="_blank">Learn Storybook</a>
