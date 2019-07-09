---
title: 'Writing a RESTful API in TypeScript: A Review'
date: '2019-07-05'
---

If you've followed JavaScript trends in recent months, you've undoubtedly witnessed the meteoric rise of TypeScript.

With <a href="https://github.com/pikapkg/web" target="_blank">top</a> <a href="https://github.com/microsoft/vscode" target="_blank">open-source</a> <a href="https://github.com/angular/angular" target="_blank">projects</a> deployed or <a href="https://news.ycombinator.com/item?id=17467141" target="_blank">rewritten</a> in the language and a growing call for adoption from <a href="" target="_blank">community luminaries</a>, embracing a new, more type-conscious JavaScript seems inevitable.

But it doesn't have to be grueling. I'm here to report back from the field having just built my first API in the language. My verdict? In short: it's worthwhile for the value it returns and the planning it requires.

### Why TypeScript?

To be transparent, I've been skeptical of TypeScript since hearing about it in 2016. The most convincing criticism I heard was by EE, who said "quote".

In simpler terms, declaring types felt like a step back into a bulkier, strongly typed language such as C++ or Java, which didn't seem as flexible as JavaScript's on-the-fly assignment.

Although it's true that TypeScript slows development time compared with vanilla JS (source?), the questions it forces the developer to answer end up making the solution stronger overall. What will the data look like for this abstraction? What are its default values? What are the expectations when mutating it? All are concerns considered earlier in a TypeScript-based project.

Adopting TypeScript also offers many tangible benefits. Among them include:

- better introspection
- better imports
- compile-time errors caught
- other stuff

Now that we've addressed why TypeScript is worth considering for projects, let's look at an example of its use in one.

### Getting Started - Project Overview

For my first TypeScript project, I built an inventory API to stay organized during my imminent move across Las Vegas. By labeling my boxes and writing detailed descriptions of what's in each container, I'm hoping to reduce time and stress from the usual relocation process.

You can check out the current state of the project on its <a href="https://github.com/alephnode/inventory-app" target="_blank">GitHub repository</a>, or follow along below for a walkthrough on setting up the project.

First, a look at the project structure (jumping into the _/backend_ directory, that is):

```bash
.
├── README.md
├── mock
│   └── inventory.json
├── package.json
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── boxes.ts
│   │   └── home.ts
│   ├── models
│   │   └── Box.ts
│   ├── server.ts
│   ├── types
│   │   └── IBoxModel.d.ts
│   └── util
│       └── secrets.ts
├── tsconfig.json
├── tslint.json
└── yarn.lock
```

The two root-level modules of note are _tsconfig.json_ and _tslint.json_. The former configures all TypeScript settings associated with the project, and the latter sets defaults for the linting that occurs during the TypeScript compilation process.

_tsconfig.json_:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*", "src/types/*"]
    }
  },
  "include": ["src/**/*"]
}
```

_tslint.json_:

```json
{
  "rules": {
    "class-name": true,
    "comment-format": [true, "check-space"],
    "indent": [true, "spaces"],
    "one-line": [true, "check-open-brace", "check-whitespace"],
    "no-var-keyword": true,
    "quotemark": [true, "single", "avoid-escape"],
    "whitespace": [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-module",
      "check-separator",
      "check-type"
    ],
    "typedef-whitespace": [
      true,
      {
        "call-signature": "nospace",
        "index-signature": "nospace",
        "parameter": "nospace",
        "property-declaration": "nospace",
        "variable-declaration": "nospace"
      },
      {
        "call-signature": "onespace",
        "index-signature": "onespace",
        "parameter": "onespace",
        "property-declaration": "onespace",
        "variable-declaration": "onespace"
      }
    ],
    "no-internal-module": true,
    "no-trailing-whitespace": true,
    "no-null-keyword": true,
    "prefer-const": true,
    "jsdoc-format": true
  }
}
```

The mock directory houses data to seed into a MongoDB database. For detailed instructions, refer to <a href="https://github.com/alephnode/inventory-app" target="_blank">the project's README.md</a> (you'll need MongoDB installed to run the script).

### Building the Interface

With config files out of the way, the next step is defining the interfaces used in the project. This is accomplished by building custom types as well as consuming packages provided by third-party dependencies.

Most libraries publish their types in a similar convention on NPM: with the @types/ prefix. For our project, we'll use those published by Lusca, Mongoose, and a few others:

```bash
yarn add --dev @types/body-parser @types/express @types/compression @types/lusca @types/node @types/dotenv @types/mongodb
```

With our dependencies installed, we're ready to build our own types, or _interfaces_, to describe the structure of the data used in our project. For my inventory app, there'll only be one type: boxes. Each box will have a <a href="https://www.guidgenerator.com/" target="_blank">GUID</a> and a summary of all the items in the box.

We define our interface in _src/types/IBoxModel.d.ts._ (d.ts is a popular convention in TypeScript denoting a file declaring a type)

_src/types/IBoxModel.d.ts_:

```javascript
import { Document } from 'mongoose'

export default interface IBoxModel extends Document {
  box: string
  items: string
}
```

The one thing to note is that we're extending the Document class from the Mongoose library since we'll eventually persist this in the NoSQL database we connect.

Since we're working with MongoDB through Mongoose, the next step is to define our schema.

_src/models/Box.ts_:

```javascript
import { Schema, model } from 'mongoose'
import IBoxModel from '../types/IBoxModel'

const BoxSchema = new Schema({
  box: String,
  items: String,
})

export default model < IBoxModel > ('Box', BoxSchema, 'boxes')
```

If you've ever worked with Mongoose, the above should look familiar. In short, we're building the object representation of our data that'll be used in the project.

### blurb about types in TypeScrript

### Bootstrapping the API

The next phase of the project is setting up the server logic and routes available from the API.

To start, we'll create the _app.ts_ file that'll do most of the groundwork for the project.

_app.ts:_

```javascript
import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import cors from 'cors'
import mongoose from 'mongoose'
import { MONGODB_URI } from './util/secrets'

// Controllers
import * as homeController from './controllers/home'
import * as boxController from './controllers/boxes'

// MongoDB connection
const mongoUrl = MONGODB_URI
mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true }
)

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xssProtection(true))
app.use(cors())

/**
 * Routes
 */
app.get('/', homeController.index)
app.get('/boxes', boxController.getBoxes)
app.post('/boxes', boxController.addBox)
app.put('/boxes/:id', boxController.updateBox)
app.delete('/boxes/:id', boxController.deleteBox)

export default app
```

To launch the server, we just need to write some code that opens a socket and listens for requests. We'll define that logic in our _server.ts_ file.

_server.ts_:

```javascript
import app from './app'

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

export default server
```

As you can see, we're just starting a process on the port specified in our _app.ts_ file in the previous step.

Once these two modules are complete, we're ready to jump into our controller logic.

### Wiring Up the Controller

### Deployment

### Conclusion

As I mentioned earlier, TypeScript enhanced the clarity of my API throughout development. What's more, VSCode's built-in intelliSense was supercharged by using it.

After being a hater for years, I'd say now's the time to reconsider any aversion to TypeScript. The tooling alone makes for a compelling case to incorporate it into projects, both new and old.

If you'd like to learn more about TypeScript-focused projects, check out the following resources:

- Microsoft Node Starter Kit
- Stencil
- something else

As always, thanks for reading.
