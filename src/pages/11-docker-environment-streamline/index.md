---
title: 'Inching Toward Dev/Prod Parity with Containerization'
date: '2019-10-29'
---

A few months ago, I moved 1,000 miles away from home to the Pacific Northwest. I've plotted my escape from the sweltering Mojave Desert for close to a decade, so the transition has been rewarding. 

With the new location came a new job, which exposed me to new methods for solving old problems. 

Specifically, conversations with colleagues have nudged me toward containerization rather than working with dev servers and/or serverless deployment targets.

Why this feels like a good idea: 
1. reduced environment- and infrastructure-specific bugs, and 
2. have granular control over the scalability, latency, and other important aspects of my services

Let's unpack these benefits a bit. 

### Incentives and Rationale

In recent years, I've gone almost exclusively serverless for my deployments. It's been a good fit given the quick app-to-deployment pipeline and lack of server maintenance, and since traffic to my projects never reaches pummeling levels.

... 😔.

Anyway,

- explain cost and resource efficiency
- allows developers more control of their infrastructure 
- introduce dev/prod parity

### Repo/Walkthrough 

After experimenting with different defaults, I eventually generated a template for future projects. You can see the repo here <link>. It consists of:

- Node for backend (obvy)
- Express for my RESTful endpoints
- TypeScript for type safety and optimal DX
- Jest for testing all the things 
- Docker for development and deployment

Alright, let's jump into it. Here's a tree of the project structure:

```
.
├── Dockerfile
├── README.md
├── dist
│   ├── index.js
│   ├── index.js.map
│   ├── index.test.js
│   └── index.test.js.map
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

As you can see, it's a lightweight starting point.

### Final Stage: Deploy in single node kube cluster

### Reading More

Hopefully by now you 

- kubernetes in action
- kubernetes podcast
- some cool feature