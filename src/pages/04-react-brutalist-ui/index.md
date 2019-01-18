---
title: 'Creating a Reusable Brutalist React Component Library with Storybook'
date: '2019-01-20'
---

Why Storybook? After building a few separate UI libs from scratch, I know it gives me the layout, look, and features I want while saving time. Plus, it's trusted by companies like airbnb, coursera, and Slack, so I know it's battle tested.

One of the best pieces of advice I've found when crafting a component library comes from Cory House's <a href="https://www.pluralsight.com/courses/react-creating-reusable-components" target="_blank">PluralSight course</a> (paywall). In it, he describes the numerous decisions one makes when implementing a component library.

- SO MANY DECISIONS TO MAKE, EXPLAIN HERE \*

_This article assumes a basic understanding of React, Node, and Yarn workflows. Refer to their respective documentation/getting started guides if you need a refresher before continuing._

To get started, I create the project's directory and initialize it with a bare _package.json_ file. (I'm using Parcel as my bundler, so remove that line if you're using sonething different.)

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

Next, initialize Storybook using their cli. I'm using npx so I don't have to install globally:

```bash
λ npx -p @storybook/cli sb init
```

_Note: if you try initializing Storybook before creating a package.json file, it'll spit an ugly error._

Storybook should detect that we're using React and initialize a bare proect for us. When the command is finished executing, you can test that everything works by running:

```bash
λ yarn storybook
```

If everything worked, you should see a basic template with an example button component, like so:

<img src="images/storybook-init.png">

<br/>

Next up, let's build the first component.

### First Component - Simple Body Text Wrapper

My components for the library will need somewhere to live, so I'll create a _components_ folder in the project's root directory. Inside this folder, I'll create my first comopnent directory: Graph.

_Graph/index.js:_

```javascript
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import { testStyles } from './styles.js'

export default ({ text, css }) => <p css={{ ...testStyles, ...css }}>{text}</p>
```

This is just a simple paragraph wrapper. Let's create the styles file I imported in the Graph declaration file:

_Graph/styles.js:_

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
