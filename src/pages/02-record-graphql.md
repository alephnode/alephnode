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

**_hotlink to skip the section_**

**_graphql blurb, explanation_**

**_also briefly describe the different concepts of graphql_**

<link to documentation and youtube video>

### <div id="prereq">Prerequisite - Prisma Signup</div>

Before I can start writing code, I'll need to <a href="https://app.prisma.io/signup">create a Prisma Cloud account</a>. Afterward, I can use their CLI tools to create a new service for my API:

```bash
λ yarn global add prisma
```

OK, time to pick a GraphQL toolkit to help setup the project and link it to the new Prisma account.

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
λ yarn add apollo-server-lambda dotenv graphql prisma-binding
λ yarn add --dev netlify-lambda
```

In summary, I installed:

- _apollo-server-lambda_, knowing that serverless was my end game
- _dotenv_ to set environment variables for local testing (we'll set those for deployment within our Netlify dashboard)
- _graphql_, as apollo-server-lambda relies on it, and
- _prisma-binding_, the bindings for the backend service I'm using.

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

To get some housekeeping out of the way, I'll create some config files for the project -- `package.json` and a `netlify.toml` file for configuring the app for Netlify's service.

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

**_ summarize wtf the toml file is doing _**

For a deeper dive into Netlify's .toml configs, here's <a href="https://www.netlify.com/docs/netlify-toml-reference/" target="_blank">the documentation</a>.

**_ prisma init time! _**

Finally, time to create our `.env` file and set it with our sensitive info we noted earlier for prisma:

```.env
PRISMA_ENDPOINT="endpoint_url_here"
PRISMA_SECRET="secret-set-here"
```
