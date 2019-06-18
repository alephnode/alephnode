---
title: 'Writing a RESTful API in TypeScript: A Review'
date: '2019-06-12'
---

If you've followed JavaScript trends in recent months, you've undoubtedly witnessed the meteoric rise of TypeScript.

With <a href="https://github.com/pikapkg/web" target="_blank">top</a> <a href="https://github.com/microsoft/vscode" target="_blank">open-source</a> <a href="https://github.com/angular/angular" target="_blank">projects</a> deployed or <a href="https://news.ycombinator.com/item?id=17467141" target="_blank">rewritten</a> in the language and a growing call for adoption from <a href="" target="_blank">community luminaries</a>, embracing a new, more type-conscious JavaScript seems inevitable.

But it doesn't have to be grueling. I'm here to report back from the field having just built my first API in the language. My verdict? In short: it's worthwhile for the value it returns and the planning it requires.

### Why TypeScript?

To be transparent, I've been skeptical of TypeScript since hearing about it in 2016. The most convincing criticism I heard was by EE, who said "quote".

In simpler terms, statically-typed variables felt like a step back into a bulkier language such as C++ or Java, which aren't as flexible as JavaScript.

Although it's true that TypeScript slows development time compared with vanilla JS, the types of questions it forces one to answer about an implementation ends up making the solution stronger overall. What will the data look like for this abstraction? What are its default values? What are the expectations when mutating it? All are concerns considered earlier in a TypeScript-based project.

Adopting TypeScript also offers many tangible benefits. Among them include:

- better introspection
- better imports
- compile-time errors caught
- other stuff

Now that we've addressed why TypeScript is worth considering for projects, let's look at an example of its use in one.

### Getting Started - Project Overview

For my first TypeScript project, I built an inventory API to stay organized during my imminent move across Las Vegas. By labeling my boxes and writing detailed descriptions of what's in each container, I'm hoping to reduce time and stress from the usual relocation process.

You can check out the current state of the project on its <a href="https://github.com/alephnode/inventory-app" target="_blank">GitHub repository</a>, or follow along below for a walkthrough on setting up the project.

First, a look at the project structure:

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

The mock directory houses data to seed into a MongoDB database.

### Building the Interface

With config files out of the way, the next step is defining and including the interfaces and types used in the project. This is accomplished in two main processes:

- defining your own types, and
- installing third-party dependency types

Most libraries publish their types in a similar convention on NPM: with the @types/ prefix. In our project's case, we use the types of XXXXXXXX.

```bash
yarn add .....
```

### Wiring Up the Controller

### Deployment

### Conclusion

As I mentioned earlier, TypeScript enhanced the safety and clarity of my API throughout development. What's more, VSCode's built-in intelliSense was supercharged because of my use of the language.

After being a hater for years, I'd say now's the time to reconsider aversion to TypeScript. The tooling alone makes for a compelling case to incorporate it into projects, both new and old.

If you'd like to learn more about TypeScript-focused projects, check out the following resources:

- Microsoft Node Starter Kit
- Stencil
- something else

As always, thanks for reading.
