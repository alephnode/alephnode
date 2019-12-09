---
title: 'Inching Toward Dev/Prod Parity with Containerization'
date: '2019-10-28'
---

<div id="img-container">
<img id="docker-img" src="./images/docker-logo.png">
</div>

A few months ago, I moved 1,000 miles away from home to the Pacific Northwest. I've plotted my escape from the sweltering Mojave Desert for close to a decade, so the migration has felt more like a victory lap of sorts.

With the new location came a new job, which exposed me to new methods for solving old problems. 

Some of those methods inspired deep dives that thrusted me into foreign waters (hence the blog hiatus 😉). Among the detours include:

- Clojure/Clojurescript _(spoiler: this is a fun time)_
- Rust _(Another insightful language. Look for that blog post coming shortly)_
- Re-examining old classics through my new O'Reilly online access
  - Grokking Algorithms is so sexy

But I'd prefer to discuss a different experiment. Specifically, conversations with colleagues have nudged me toward considering containerization over dev servers and/or serverless deployments.

Why I'm entertaining the idea: 
1. reduced environment- and infrastructure-specific bugs, and 
2. have granular control over the scalability, latency, and other important aspects of my services

Let's unpack these benefits a bit. 

### Incentives and Rationale

In recent years, I've gone almost exclusively serverless for projects. It's been efficient given the quick app-to-deployment pipeline and lack of server maintenance.

I've also stuck to serverless since my initial investigation of scaling Docker in 2017 found it to involve more manual toil than I was willing to invest. (Well, on AWS, anyway, which was the cloud provider for my work at the time.) 

In the vast, expansive future of 2019, this is no longer the case. 

Management solutions like Kubernetes leverage the power of containerization—which enables developers to strictly define the components that constitute their applications—to manage all networking and infrastructure concerns in a concise, declarative way. 

This added level of control imbues developers with confidence in their services due to _dev/prod parity_.

The idea is that, in development, you're running a dev server that's running on your laptop's operating system. Whether that be MacOS, Windows, or a Linux flavor, it's probably not the _exact_ same OS on the server that'll eventually host your app. That's another variable to consider when troubleshooting bugs encountered on the service. 

Even if the OS is the same, perhaps you're making assumptions about what's already installed on the server, or certain environment variables that are already set on your machine.

Containerization seeks to reduce this problem space. With all dependencies, commands, and environment workflows detailed in a _Dockerfile_, the Docker daemon can pull from common repositories and run identical versions of services on local dev machines and production servers alike. 

After experimenting with different defaults on a few projects, I've formulated some opinions and generated a template for future projects.

### Starter Kit Walkthrough

If you'd like to skip the explanation, you can see the finished repo <a href="https://github.com/alephnode/tdd-ts-docker-starter" target="_blank">here</a>. 

As for the opinions/assumptions being made, it consists of:

- Node for backend
- Express for my RESTful endpoints
- TypeScript for type safety and optimal DX
- Jest for testing all the things 
- Docker for development and deployment

Alright, let's jump into it!

First, here's the tree structure for the project:

```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── jest.config.js
├── package.json
├── src
│   ├── index.test.ts
│   └── index.ts
├── tsconfig.json
├── tslint.json
└── yarn.lock
```

As you can see, it's a bare-bones starting point with only a few files. To get a better sense of the project, we'll examine three in particular. 

_Dockerfile_:

```
FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 8000

CMD ["yarn", "start"]
```

If you've used Docker before, the above should look like a typical NodeJS-based deployment. We copy over files, install our dependencies, and start the server. 

This would give us a server to spin up, but we have bigger plans for our project. 

_docker-compose.yml_:

```
version: '3.1'

services:
  tdd-ts-docker-starter:
    build: .
    image: tdd-ts-docker-starter
    ports:
      - "8000:8000"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./src:/usr/src/app/src"
      - "./dist:/usr/src/app/dist"


  tdd-ts-docker-starter-tests:
    image: tdd-ts-docker-starter
    command: yarn test -o --watch
    environment:
      APP_URL: http://tdd-ts-docker-starter:8000
    volumes:
      - "./src:/usr/src/app/src"
    depends_on:
      - tdd-ts-docker-starter
```

The _docker-compose.yml_ file's purpose is to run the development server alongside a testing server in watch mode. This way, I'm alerted of breaking changes instantaneously. 

The full documentation for the YAML file's syntax is available <a href="https://docs.docker.com/compose/compose-file/" target="_blank">here</a>, but a few call-outs are:

- the first of our two services builds based on the Dockerfile detailed above
- the Docker socket is mounted for the two services to communicate. Note to <a href="https://stackoverflow.com/questions/40844197/what-is-the-docker-security-risk-of-var-run-docker-sock" target="_blank">not do this in production</a>
- the test server is watching for changes to the mounted src/ directory in order to know when to restart

_Note: This file is specific to my development workflow. If I were to deploy this service, I'd do so as a single-node Kubernetes cluster or as a standalone container hosted on a virtual box through a cloud provider. For that reason, only the Dockerfile would be used._

For the final piece, we'll take a look at the _package.json_ scripts that make all this configuration come together:

_package.json_:

```
// ...
  "scripts": {
    "dev": "tsc && docker-compose up --build --abort-on-container-exit",
    "start": "npx nodemon --watch 'src/**/*' --exec 'ts-node' src/index.ts",
    "test": "npx jest",
  },
// ...
```

Of the three commands listed, `dev` is the most interesting. In it, we run the Typescript compiler to build our project, then spin up our docker-comopse project (the dev and test servers). The `start` command is what the dev server will run, which just launches a server via the awesome nodemon library. Obviously, `test` runs our Jest test suite.

With just three simple files, my development and production workflows are clearly defined. No lambda-specific function signatures or boilerplate means I can switch cloud providers overnight and be back in business within hours. Not bad!

### Next Steps

This post was admittedly less ambitious than previous articles. It served more to catalog promising development experiments rather than pass along bulletproof information. 

It's a topic I wanted to explore but also hope to enhance my understanding of in months to come. Look for a report on my experience deploying a Docker-based project on a few providers in the coming posts.

Until then, here are a few of the most fruitful references I encountered in my studies:

- <a href="https://learning.oreilly.com/library/view/kubernetes-in-action/9781617293726/" target="_blank">Kubernetes in Action</a>
- <a href="https://docs.docker.com/get-started/" target="_blank">Docker Getting Started</a>
- <a href="https://aws.amazon.com/eks/" target="_blank">AWS EKS Services</a>

If you see issues with my approach for Docker in development, please feel free to open an issue on the repo linked so we can discuss. The goal is to find the optimal development experience with the greatest benefits.

As always, thanks for reading!