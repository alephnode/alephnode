---
title: 'Inching Toward Dev/Prod Parity with Containerization'
date: '2019-10-29'
---

A few months ago, I moved 1,000 miles away from home to the Pacific Northwest. I've plotted my escape from the sweltering Mojave Desert for close to a decade, so the transition was rewarding. 

With the new location came a new job, which exposed me to new methods for designing software.

One such method resulted in a change to my existing development and deployment workflows. Specifically, I've moved toward containerization and pushing environment-specific logic through config files rather than working with dev servers and serverless deployment targets.

Now, I ship with greater confidence knowing I've 
1. reduced environment- and infrastructure-specific bugs, and 
2. have granular control over the scaling ability, latency, and other important aspects of my services

### Incentives and Rationale

In recent years, I've gone almost exclusively serverless for my deployment strategy. It was a good fit given the quick app-to-deployment pipeline and lack of server maintenance, and since traffic to my projects never reaches pummeling levels.

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

The TDD part refers not to the technology used but in the development process employed. Rather than `npm start` launching nodemon or some dev server, it builds and runs two Docker containers: one that serves the main application and another that runs tests in watch mode for real-time alerts when existing logic breaks.

Here's a tree of the project structure:

<tree>

As you can see, it's a lightweight starting point.

### Final Stage: Deploy in single node kube cluster

### Reading More

- kubernetes in action
- kubernetes podcast
- some cool feature