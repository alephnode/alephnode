---
title: 'Creating a Reusable Brutalist React Component Library with Storybook'
date: '2019-01-20'
---

<div id="header-img-container">
<img id="gql-img" src="./images/storybook-logo.svg">
<div class="src-container"><span class="source"><i>source: https://storybookjs.org</i></span></div>
</div>

One of the most valuable tools in component-based design is a self-documenting repository that's generic enough for use across multiple projects. DRY, as the cool kids say.

Since the last few component libraries I've built have been home-rolled, I was curious what the open-source community had to offer for launching one quickly.

After vetting a few notable candidates, I chose <a href="https://storybookjs.org" target="_blank">Storybook</a> as my sandbox.

Why, you ask? First, it gives me a sensible layout, presentable look, and showcase of features -- saving hours of work as a result. It's also trusted by companies like airbnb, coursera, and Slack, so I know it's battle-tested.

Although there could be more customizatable features available on the platform -- <examples>, I was able to get the hang of the "Storybook way" of documenting my components within a few short minutes and ship an online reference within a few hours ✨.

### Getting Started

One of the best pieces of advice I've found when crafting a component library comes from Cory House's <a href="https://www.pluralsight.com/courses/react-creating-reusable-components" target="_blank">PluralSight course</a> (paywall). In it, he describes the numerous decisions one makes when implementing a component library. Some of them include:

- To which (if any) design system will the component styles/UX adhere?
- CSS-in-JS or stylesheets?
- Which build types will be shipped (UMD, AMD, ESModules, etc)?
- Should the developer be allowed to override styles?

After careful thought for my test project, I chose a Brutalist design systen for three reasons:

<ol>
<li>The style essentialy submits full creative license to the designer, and</li>
<li>An MVP would be relatively quick since the elements found on most Brutalist-inspired sites are notably straightforward.</li>
<li>I like the way it looks. <i>(It's a palate cleanser of sorts.)</i></li>
</ol>

I also chose to use Emotion for my styling library. I've used it in a few projects and admire its versatility. I also intend to publish this to NPM in the form of a **\_\_**, so I'll use **\_\_**.

With a few key decisions made, it's time to start coding.

You can view the finished project <a href="https://react-brutalist-ui.sh" target="_blank">here</a>, or check out the <a href="https://github.com/alephnode/react-brutalist-ui" target="_blank">source code on GitHub</a>.

_Note: This article assumes a basic understanding of React, Node, and Yarn workflows. Refer to their respective documentation/getting started guides if you need a refresher before continuing._

### Initializing the Project

For reference, the finished repo tree will look like this:

```
.
├── README.md
├── package.json
├── src
│   ├── components
│   │   ├── Button
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── Container
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── Graph
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── Headline
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── Input
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── Login
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   └── Marquee
│   │       ├── index.js
│   │       └── styles.js
│   ├── global.css
│   ├── stories
│   │   ├── All.stories.js
│   │   ├── Button
│   │   │   ├── Button.stories.js
│   │   │   └── ButtonDescription.md
│   │   ├── Container.stories.js
│   │   ├── Graph.stories.js
│   │   ├── Headline.stories.js
│   │   ├── Input.stories.js
│   │   ├── Login.stories.js
│   │   ├── Marquee.stories.js
│   │   └── index.stories.js
│   └── theming
│       ├── colors.js
│       ├── layouts.js
│       └── type.js
├── static
│   └── favicon.ico
└── yarn.lock
```

To start, I navigate to the project directory and create a _package.json_ file. (I'm using Parcel as my bundler, so swap it out if you'd like to use sonething different.)

_package.json:_

```javascript
{
  "name": "react-brutalist-ui",
  "version": "0.0.1",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "@storybook/addon-options": "^4.1.9",
    "emotion": "^10.0.6",
    "prop-types": "^15.6.2",
    "react": "^16.8.0-alpha.1",
    "react-dom": "^16.8.0-alpha.1",
    "react-emotion": "^10.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.2.2",
    "@storybook/addon-actions": "^4.1.6",
    "@storybook/addon-console": "^1.1.0",
    "@storybook/addon-info": "^4.1.9",
    "@storybook/addon-links": "^4.1.6",
    "@storybook/addons": "^4.1.6",
    "@storybook/react": "^4.1.6",
    "@storybook/storybook-deployer": "^2.8.1",
    "babel-loader": "^8.0.5",
    "parcel-bundler": "^1.11.0"
  },
  "scripts": {
    "start": "parcel index.html",
    "build": "build-storybook -c .storybook -s ./static -o build",
    "deploy": "now ./build",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook"
  }
}
```

Next, I initialize Storybook using their cli. (I'm using npx so I don't have to install globally):

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

**# I should add the generated Storybook files section here, explaining some stuff/defaults #**

With Storybook properly running, it's time to get some shared styles and theming out of the way for use in my components.

### Layouts

The first layout file I'll create is for the color schemes used throughout the application. In brutalism, it's common to use basic, bold colors, so I'll add a few to my palette:

_./src/theming/colors.js:_

```javascript
export const COLORS = {
  BLACK: '#272727',
  WHITE: '#FFFFFF',
  RED: '#FF0000',
  BLUE: '#0000FF',
  LIGHT_GRAY: '#C6C4C5',
}
```

I'll also create a file for common layouts used for containing elements and UI templates.

_./src/theming/layouts:_

```javascript
//insert layouts here
```

Finally, I'll define a few global typography choices in a dedicated module. Brutalist design tends to favor system defaults and courier, so I'll create variables for those.

_./src/theming/type.js:_

```javascript
const TYPE = {
  PRIMARY: 'Courier, sans-serif',
}

TYPE.SECONDARY = TYPE.CAPTION = TYPE.LABEL = TYPE.LINK =
  '-apple-system, BlinkMacSystemFont, HelveticaNeue, Helvetica, Roboto, Arial, sans-serif'

export { TYPE }
```

Now that I've scaffolded a few global styles, it's time to start on the fun part: building the components 🔨!

### First Component

I'll create a _components_ folder in _./src_ to house all the reusable elements in my library. Inside this directory, I'll add my first component: Graph.

_./src/components/Graph/index.js:_

```javascript
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import { graphStyles } from './styles.js'
import PropTypes from 'prop-types'

const Graph = ({ text, styles }) => (
  <p css={{ ...graphStyles, ...styles }}>{text}</p>
)

Graph.propTypes = {
  text: PropTypes.string.isRequired,
  styles: PropTypes.object,
}

Graph.defaultProps = {
  text: 'Example Graph text',
  styles: {},
}

export default Graph
```

This is just a simple paragraph wrapper. I add the propTypes and defaultProps to populate the info table provided by Storybook (explained later). Let's create the styles file I imported in the Graph declaration file:

_./src/components/Graph/styles.js:_

```javascript
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { COLORS } from '../../theming/colors.js'
import { TYPE } from '../../theming/type.js'

export const graphStyles = css`
  color: ${COLORS.BLACK};
  font-family: ${TYPE.SECONDARY};
`
```

By default, Storybook looks for _\*.stories.js_ files in a _stories_ directory in the root of your project. If you'd like to change this location, modify the following line in the Storybook config:

_/.storybook/config.js:_

```javascript
import { addDecorator, configure } from '@storybook/react'
import { withOptions } from '@storybook/addon-options'
import { themes } from '@storybook/components'
import '@storybook/addon-console'

addDecorator(
  withOptions({
    name: 'Brutalist UI',
    url: 'https://github.com/alephnode/react-brutalist-ui',
  })
)

// automatically import all files ending in *.stories.js
// change this line if you must
const req = require.context('../src/stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
```

For more helpful resources, check out:

- <a href="https://www.learnstorybook.com/" target="_blank">Learn Storybook</a>
