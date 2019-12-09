---
title: 'Inching Toward Dev/Prod Parity with Containerization'
date: '2019-10-28'
---

A few months ago, I moved 1,000 miles away from home to the Pacific Northwest. I've plotted my escape from the sweltering Mojave Desert for close to a decade, so the migration has felt more like a victory lap of sorts.

With the new location came a new job, which exposed me to new methods for solving old problems. 

Specifically, conversations with colleagues have nudged me toward containerization rather than working with dev servers and/or serverless deployment targets.

Why I'm entertaining the idea: 
1. reduced environment- and infrastructure-specific bugs, and 
2. have granular control over the scalability, latency, and other important aspects of my services

Let's unpack these benefits a bit. 

### Incentives and Rationale

In recent years, I've gone almost exclusively serverless for deployments. It's been efficient given the quick app-to-deployment pipeline and lack of server maintenance.

I've also stuck to serverless since my initial investigation of scaling Docker in 2017 found it to involve more manual toil than I was willing to invest. (Well, on AWS, anyway, which was the cloud provider for my work at the time.) 

In the vast, expansive future of 2019, this is no longer the case. Management solutions like Kubernetes leverage the power of containerization—which enables developers to strictly define the pieces that constitute their applications—to manage all networking and infrastructure concerns in a concise, declarative way. 

This added level of control increases confidence in the reliability of services due to something called _dev/prod parity_.

The idea is that, in development, you're running a dev server that's running on your laptop's operating system. Whether that be MacOS, Windows, or a Linux flavor, it's probably not the _exact_ same OS on the server that'll eventually host your app. That's another variable to consider when troubleshooting bugs encountered on the service. 

Even if the OS is the same, perhaps you're making assumptions about what's already installed on the server, or certain environment variables that are already set on your machine.

Containerization reduces this problem space. With all dependencies, commands, and environment workflows detailed in a _Dockerfile_, the Docker daemon can pull from common repositories and run identical versions of services on local dev machines and production servers alike. 

_For more details on the core concepts of images, containers, and other Docker-related terms, check out this helpful guide._

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
├── dist
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

- Make note of helpfulness in dev environment for for testing in env that matches lambda prod 
- Make it so tests aren't brought into dist 

### Final Stage: Deploy in single node kube cluster

- highlight simplicity of deployment, benefits of k8s

### Reading More

Hopefully by now you 

- kubernetes in action
- kubernetes podcast
- some cool feature