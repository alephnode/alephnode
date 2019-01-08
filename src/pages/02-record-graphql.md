---
title: 'Building a Serverless GraphQL API for My Record Collection'
date: '2019-01-08'
---

Although I had no formal resolution for the new year, the season _did_ inspire me to revisit tasks that've piled onto my backlog in recent months.

One of the neglected items was a virtual catalog of my record collection. After considering a few different ways to approach the project, an idea took shape 💡: build a GraphQL API and serve it over the web with as little friction as possible.

To accomplish this, I deployed the project as a function using Netlify, with Prisma Cloud handling the backend. (Both services are definitely worth checking out and are detailed below.)

Taken together, the tools helped me ship a lightweight, serverless API in no time.

You can see the finished result <a href="https://agitated-ptolemy-91fe65.netlify.com/api" target="_blank">here</a>, or jump straight to <a href="https://github.com/srmward/netlify-prisma-graphql-starter-kit" target="_blank">the source</a> if you'd prefer.

_Please note that this article assumes a basic understanding of node and yarn workflows. Refer to their respective references/getting started guides if you need a refresher before continuing._

### Wait, Why GraphQL?

_This section will give a brief summary of GraphQL and its benefits. Feel free to [skip ahead to the walkthrough](#prereq) if desired._

**_graphql blurb, explanation_**

**_also briefly describe the different concepts of graphql_**

<link to documentation and youtube video>

### <div id="prereq">Prerequisite - Prisma Signup</div>

Before I can start writing code, I'll need to <a href="https://app.prisma.io/signup">create a Prisma Cloud account</a>. Afterward, I can use their CLI tools to create a new service for my API:

```bash
λ yarn global add prisma
```

OK, time to pick a GraphQL toolkit to help kickstart the project and link it to the new Prisma account.

### Coding the Project

Using Node, there are a few frameworks and toolsets for implementing a GraphQL API available. Among the most popular are:

- graphql-yoga
- apollo-server
- graphql-express

While I chose graphql-yoga to build my sweet <a href="https://plant-help.co" target="_blank">plant help app</a> last summer, I went with Apollo server after being impressed with the project's <a href="https://www.apollographql.com/docs/apollo-server/" target="_blank">documentation</a> and growing popularity in the JS ecosystem. That said, graphql-yoga is released and maintained by Prisma, so it's definitely worth <a href="https://github.com/prisma/graphql-yoga">checking out</a>.

OK, time to initialize the project and install dependencies:

```bash
λ mkdir record-collection-api
λ cd record-collection-api
λ yarn add apollo-server-lambda dotenv graphql prisma-binding netlify-lambda
```

In detail, I installed:

- _apollo-server-lambda_, knowing that serverless was my end game
- _dotenv_ to set environment variables for local testing (we'll set those for deployment within our Netlify dashboard)
- _graphql_, as apollo-server-lambda relies on it, and
- _prisma-binding_, the bindings for the backend service I'm using.

Alright, now onto building out our configs.

For reference, this is what the finished directory structure will look like:

```
.
├── README.md
├── database
│   ├── datamodel.prisma
│   └── prisma.yml
├── lambda
│   └── index.js
├── netlify.toml
├── package.json
├── public
│   ├── _redirects
│   └── index.html
├── server
│   └── index.js
├── src
│   ├── generated
│   │   └── prisma-schema.js
│   ├── resolvers
│   │   ├── Query.js
│   │   └── index.js
│   └── schema.js
└── yarn.lock

```

The first bit of files to build are `package.json` and `netlify.toml`.

package.json:

```javascript
{
  "name": "record-collection-api",
  "version": "1.0.0",
  "description": "Record collection GraphQL API",
  "main": "handler.js",
  "keywords": [],
  "license": "MIT",
  "scripts": {
    "serve": "netlify-lambda serve server",
    "build": "netlify-lambda build server"
  },
  "dependencies": {
    "netlify-lambda": "^0.4.0",
    "apollo-server-lambda": "^2.3.1",
    "dotenv": "^6.2.0",
    "graphql": "^14.0.2",
    "prisma-binding": "^2.2.13"
  }
}

```

Notice the scripts section and how it uses netlify-lambda. `serve` is how we test our functions locally, and `build` is the script we want to run once the service is deployed. We'll cover this more in the next section.

netlify.toml:

```toml
[build]
  Command = "yarn build"
  Functions = "lambda"
  Publish = "public"
```

This file configures some details related to our eventual Netlify project. `Command`, as mentioned above, is what we want to run once the project is deployed. `Functions` refers to the location of our functions for deployment (netlify-lambda will write this for us when we start the dev environment), and `Publish` identifies the target directory that contains the deploy-ready HTML files for the project.

For a deeper dive into Netlify's .toml configs, here's <a href="https://www.netlify.com/docs/netlify-toml-reference/" target="_blank">the documentation</a>. Read more about best practices for using it with `netlify-lambda` <a href="https://github.com/netlify/netlify-lambda" target="_blank">here</a>.

It's time to hook in Prisma. from the root directory, run:

```bash
λ prisma init
```

<this is where you get the prisma endpoint, I believe. Go through getting the deom server and adding a secret>

<the database file, adding info to prisma.yml>

Finally, time to create our `.env` file and set it with our sensitive info we noted earlier for prisma:

```.env
PRISMA_ENDPOINT="endpoint_url_here"
PRISMA_SECRET="secret-set-here"
```

Now that the configs are out of the way, I'm ready to start on app-specific logic.

### GraphQL Implementation

The handler for my code will live in server/index.js, so I'll start there.

server/index.js:

```javascript
require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server-lambda')
const { Prisma } = require('prisma-binding')
const { typeDefs: td } = require('../src/generated/prisma-schema')
const typeDefs = require('../src/schema')
const resolvers = require('../src/resolvers')

const server = new ApolloServer({
  typeDefs: gql`
    ${typeDefs}
  `,
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: td,
      secret: process.env.PRISMA_SECRET,
      endpoint: process.env.PRISMA_ENDPOINT,
    }),
  }),
})

exports.handler = server.createHandler()
```

There's quite a bit to unpack here, but it'll provide a high-level overview of how the service will function.

I define the server, which is a new ApolloServer instance. It takes typeDefs (using the `gql` tagged template literal to ensure it's in its proper schema format) as well as resolvers as arguments. The third argument is context, which is where I'll use the `prisma-binding` library to hook in my new Prisma service into the API. Finally, I export the server in the form of our handler since this is the format netlify needs (explained in the deployment section).
