---
title: 'Experimenting with Base Web and Serverless AWS'
date: '2019-04-16'
---

notes: worth it

- cognito user pool

  - create new, intuitive name, accept the defaults
    - list the defaults
    - grab pool ID
  - create app client for the cognito pool for later use

    - for node, don't want to generate client secret

  - next is creating the table for the data

    - create table in dynamodb dashboard, hold onto ARN for table - need when linking to lambda
    - create IAM role for lambda fn
    - create lambda fn for request

There's no shortage of AWS tutorials online, and even more Node-based API how-to's to boot.

 Too often, the articles follow the same template (as has this blog in recent posts): introduce the topic's relevance in the modern tech landscape, preview the example project, enumerate the steps to create something similar, and, finally, wrap up with helpful resources.

That's fine (and I'll probably continue with said pattern), but it's worthwhile to pause and reflect on the _why_ certain steps are taken, rather than explicitly describing the _how_. 

While trying to jump back into writing after taking a study break during the month of April, I found myself hacking away at a post on how to implement a serverless RESTful API in the AWS ecosystem. You can find the example repo _here_, but I implore you to resist the urge to click the link. What I have to offer is more than just an example project. I think the patterns for deploying an API to AWS enforce a set of best practices that are worth highlighting.

### Step One: Cognito User Pools, Permission Sets

### Step Two: Lambda Declarations

### Step Three: API Gateway and Access Control

### Step Four: S3

Not to break entirely from tradition, here are a few insightful resources to check out:

_links_

As always, thanks for reading. 
