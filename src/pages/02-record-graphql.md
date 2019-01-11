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

Now's a good time to provide a high-level overview of what the finished directory structure will look like:

```
.
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

Alright, onto the configs.

The first files to create are `package.json` and `netlify.toml`.

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

It's time to hook in Prisma. Granted, this step will feel slightly odd because we're going to remove most of the files generated. We do this from the command line because it's the <a href="https://www.prisma.io/docs/get-started/01-setting-up-prisma-demo-server-JAVASCRIPT-a001/" target="_blank">current documented way</a> to receive an endpoint for a new Prisma Cloud service.

Open a terminal and run:

```bash
λ prisma init
```

The command prompt will ask whether to create a new prisma server or link to an existing one. Select "Demo server" and the desired region afterward (right now, they only offer the demo servers in Ireland and the Western US).

After setting a name and staging environment, the prompt asks which programming language will be used. If you're following along, select "Prisma JavaScript Client" and hit enter. Once this is complete, a few files will have been generated:

- datamodel.prisma
- prisma.yml
- generated/index.d.ts,index.js,prisma-schema.js

First, delete the generated directory, as we'll regenerate in a moment.

Next, open up the prisma.yml file. You'll need the endpoint to initialize the `prisma-binding` library later, so keep it nearby.

If you'd like to set a secret for added protection, you can configure that within this .yml file:

prisma.yml:

```yaml
# ...
endpoint: your-endpoint-here
secret: your-super-secret-here
# ...
```

FWIW, prisma recommends an added level of protection for production services. Read more about it <a href="https://www.prisma.io/docs/1.17/run-prisma-server/authentication-and-security-kke4/" target="_blank">here</a>.

You can also specify the desired location of the files that Prisma generates. As you might have noticed in the directory structure above, mine is located at:

- src/generated/

... so I'll add that under the generate section of the yml file:

```yaml
# ...
generate:
  - generator: javascript-client
    output: ../src/generated/
```

The `datamodel.prisma` file is automatically generated during the `prisma init` step, but the model initially created didn't have the proper schema. Remove everything from the file and replace it with our record schema:

datamodel.prisma:

```
  type Artist {
    id: ID! @unique
    name: String!
    records: [Record]
  }

  type Record {
    id: ID! @unique
    name: String!
    tracks: [Track]
  }

  type Track {
    id: ID! @unique
    name: String!
    track_no: Int
    artists: [Artist]
  }

  type Category {
    id: ID! @unique
    name: String!
    description: String
  }
```

Now that we've tailored the Prisma files to our project, it's time to re-generate:

```bash
λ prisma generate
```

If done properly, this newly generated directory will be created in the desired spot (the `generate` option in `prisma.yml` above) and match the schema detailed in `datamodel.prisma`.

Since we have our Prisma information, we can populate our `.env` file with the sensitive info:

```.env
PRISMA_ENDPOINT="endpoint_url_here"
# if you set a secret in the prisma.yml file,
# add it here to pass to prisma-bidning
PRISMA_SECRET="secret-set-here"
```

Now that the configs are out of the way, it's time to start on API-specific logic.

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

I define the server, which is a new ApolloServer instance. It takes typeDefs (using the `gql` tagged template literal to ensure it's in its proper schema format) as well as resolvers as arguments. The third argument is context, which is where I'll use the `prisma-binding` library to hook in my new Prisma service into the API. Notice how I import the typeDefs generated within `src/generated/prisma-schema.js`, renaming it to distinguish from the app schema also required in the module.

Finally, export the server in the form of our handler since this is the format Netlify needs (explained in the deployment section).

The next file we will create is `src/schema.js`, which holds the typeDefs passed to our ApolloServer instance. As noted earlier, the typeDefs define the schema for our service:

src/schema.js:

```javascript
module.exports = `
  type Query {
    info: String!
    records: [Record!]!
    artists: [Artist!]!
    artist(name: String): [Artist!]!
    tracks: [Track!]!
    categories: [Category]
  }

  type Artist {
    id: ID!
    name: String!
    records: [Record]
  }

  type Record {
    id: ID!
    name: String!
    tracks: [Track]
  }

  type Track {
    id: ID!
    name: String!
    track_no: Int
    artists: [Artist]
  }

  type Category {
    id: ID!
    name: String!
    description: String
  }
`
```

Pretty self-explanatory if you paid attention to the GraphQL blurb earlier 😃.

Next, define the resolvers that'll map data to functions that know what to do with it.

Define queries in Query.js:

```javascript
module.exports = {
  artists: (_, args, context, info) => {
    return context.prisma.query.artists({}, info)
  },
  records: (_, args, context, info) => {
    return context.prisma.query.records({}, info)
  },
}
```

For now, I've just written some getters for the artists and records.

Lastly, I'll create an index file at src/resolvers that passes Query as a property:

src/resolvers/index.js:

```javascript
const Query = require('./Query')

module.exports = {
  Query,
}
```

And with that, I'm ready to test this locally before deploying 🤘.

### Running the Local Server

Let's spin up the dev server and make sure the project looks good. From the root of the project directory, open a terminal and run:

```bash
λ yarn serve
```

This should start the dev server on port 9000. If you go to http://localhost:9000/index in a web browser, it will launch the GraphQL playgound. This is a graphical interface to explore the API and experience the beautiful introspection that comes with the spec. Give it a try yourself.

After checking that queries return the intended results, it's time to deploy the API live to Netlify.

### Deploying to Netlify

The easiest way to add a site to Netlify is to connect it to a GitHub repository and push an update to it. This is the allure of Netlify when prototyping-<a href="https://www.netlify.com/docs/continuous-deployment/" target="_blank">effortless, streamlined CD integration</a>.

Once you create an account (if you haven't already) and <a href="https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/" target="_blank">follow the instructions on the Netlify site</a> to connect the service to your repository, the next push will trigger a deployment. When it's published, you should see a URL provided in the Netlify dashboard for the service.

For example, mine is located <a href="https://agitated-ptolemy-91fe65.netlify.com/api" target="_blank">here</a>.

If you see the screen above, congrats! You've successfully deployed your first serverless API :D

### Wrapping Up

What started as a lazy Saturday morning ended in a neglected task scratched off my to-do list, all thanks to a few powerful services available in the JS ecosystem today.

Although a lot of ground was covered architecting the GraphQL API and deploying it to a serverless offering, there's still a lot to learn.

For more information about the spec, or for alternative impelemntation choices, check out these awesome resources:

- [HowToGraphQL](https://www.howtographql.com/)
- [Deploying a GraphQL API with a Self-Hosted Database](https://medium.freecodecamp.org/graphql-zero-to-production-a7c4f786a57b)
- [Combine Graphql Server with React Client](https://blog.apollographql.com/deploy-a-fullstack-apollo-app-with-netlify-45a7dfd51b0b)

As always, thanks for reading!
