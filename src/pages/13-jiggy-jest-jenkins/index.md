---
title: 'Getting Jiggy with Jest and Jenkins'
date: '2020-01-12'
---

TODO break this into submodules and sub submodules
TODO include a step about breaking project down afterward

OK, we'll do it this way. Intro will present itself once other parts are more fleshed out, personal touches are considered. For now, let's create an outline.

- Importance of testing, emphasis on code you inherit. Make comparison of reason, too. Constantly be challenging assumptions while allowing them to establish a foundation for critical thought.

- XP, extreme programming intro, refer to Accelerate book
- Stack of choice. Test and CICD, importance of both
- also explain example project, TDD approach taken
- walk through project !
- pick a domain/deployment TARGET
- hook it up to jenkins
- find a way to wrap it up in a cool way
- conclusion, referral to books
- NOTE: when setting up the lambda, you have to grant the lambda Comprehend permission. I do full access
- https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf (excellent jenkins build server)

### High-Level Project Overview

Before we jump in, here's the tree structure for the project:

```
.
├── Jenkinsfile
├── README.md
├── deploy.sh
├── jest.config.js
├── package.json
├── src
│   ├── __mocks__
│   │   ├── aws-sdk.ts
│   │   └── mockAWSResponse.ts
│   ├── __tests__
│   │   ├── getSentiment.test.ts
│   │   ├── index.test.ts
│   │   └── sanity.test.ts
│   ├── getSentiment.ts
│   ├── index.ts
│   ├── responses
│   │   └── invalidDataSupplied.ts
│   ├── sanity.ts
│   └── validators
│       └── isValidEvent.ts
├── tsconfig.json
└── yarn.lock
```

We'll cover most of the config-related files in later sections, but it's worth popping open _jest.config.js_ to see how our project's test suite will behave.

_jest.config.js_:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src', 'dist'],
  collectCoverage: true,
}
```

Nothing controversial being done here. I'm including a preset for Jest so it knows I'm using Typescript, and also specifying my root directories and test environment. For more info on configuring Jest, check out the project's thorough <a href="https://jestjs.io/docs/en/configuration" target="_blank">documentation</a>.

Finally, have a look at my _package.json_ file to see what's installed:

```json
{
  "name": "get-sentiment-score",
  "version": "1.0.21",
  "description": "",
  "main": "dist/index.js",
  "dependencies": {
    "aws-sdk": "^2.601.0",
    "nodemon": "^1.19.4"
  },
  "scripts": {
    "test": "jest -i",
    "build": "tsc",
    "start": "npx nodemon --watch 'src/**/*' --exec 'ts-node' src/index.ts",
    "deploy": "./deploy.sh"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/aws-lambda": "^8.10.39",
    "@types/jest": "^24.0.18",
    "@types/node": "^12.6.9",
    "jest": "^24.9.0",
    "ts-jest": "^24.0.2",
    "ts-node": "^8.3.0",
    "typescript": "^3.5.3"
  }
}
```

Not much to include with this project aside from the AWS SDK, Jest, and project-specific utilities (config presets and the types for our external libraries).

### Getting Started: Tests First

Instead of using the results-first flow of previous articles, we're going to build the project incrementally with tests that explain what we'd _like_ to accomplish and then implement logic that gets them to pass. To many, this is the heart of <b>Test-Driven Development, or TDD</b>. It's also a commendable philosophy to practice, and nearly essential when taking on legacy code bases.

Let's create our first test file. Because this project involves compilation steps, test suite configuration, a CI/CD layer, and deployment scripts, there's quite a bit that could go wrong from development to release. For this reason, I generally include a canary endpoint/module in these types of projects that serves as a base case. I name these files _sanity.\*_ because, as the name implies, they exist solely for me to troubleshoot base integrations if anything goes awry.

Implementing my canary module will start with a test. Because the purpose is for the file to be simple, I'll assert that the sanity module returns a simple "Hello, World!" response.

_src/\_\_tests\_\_/sanity.test.ts_:

```typescript
import { handler, SanityResponse } from '../sanity'

describe('Sanity tests', () => {
  it('passes canary', () => expect(true).toBe(true))
  it('responds with expected string', () =>
    handler(null, null, (_1, res: SanityResponse) =>
      expect(res.body).toEqual('Hello World!')
    ))
})
```

Note that Jest provides test running methods as well as assertion functions out of the gate. This is convenient for those who don't want to import a library at the top or download two separate libs for test handling (I'm looking at you, `mocha` and `chai`).

OK, let's implement this simple case and make the test pass.

_src/sanity.ts_:

```typescript
import { Handler, Context, Callback } from 'aws-lambda'

interface SanityResponse {
  statusCode: number
  body: string
}

const handler: Handler = (event, context: Context, cb: Callback) => {
  const response: SanityResponse = {
    statusCode: 200,
    body: 'Hello World!',
  }

  cb(null, response)
}

export { handler, SanityResponse }
```

The exported handler in this module returns a response body with the payload expected in our test.

Alright, onto our _actual_ project logic.

Since our deploy target is a lambda function, my app's entry point will need to be a file with an exported handler function. Let's start with writing the test file for this module.

_src/\_\_tests\_\_/index.test.ts_:

```typescript
import { handler } from '../index'
import { invalidDataSupplied } from '../responses/invalidDataSupplied'

describe('Index tests', () => {
  it('responds with expected string with valid params', async () => {
    const res = await handler({ details: { text: 'hello' } }, null, null)
    expect(res).toBeTruthy()
  })
  it('responds with error with valid params', async () => {
    const res = await handler({ details: { message: 'hello' } }, null, null)
    expect(res).toEqual(invalidDataSupplied)
  })
})
```

Again, we use some Jest-specific functions for describing our tests, breaking them into separate units, and asserting the value of the functions we're testing. One thing to note is that each test written can be expressed as having three distinct sections: <strong>arranging </strong>the data and functions needed, <strong>acting</strong>, or performing the operation you're wanting to test, and <strong>asserting</strong> the expected value or effect of the operation. As it turns out, these three A's are a common mnemonic device in the TDD community.

Anyhow, onto the implementation of our root handler.

_src/index.ts:_

```typescript
import { Handler } from 'aws-lambda'
import { getSentiment } from './getSentiment'
import { isValidEvent } from './validators/isValidEvent'
import { invalidDataSupplied } from './responses/invalidDataSupplied'

type SentimentEvent = {
  details: {
    text: string
  }
}

const handler: Handler = async (event: SentimentEvent) => {
  if (!isValidEvent(event)) return invalidDataSupplied
  const params = event.details
  return await getSentiment()
}

export { handler, SentimentEvent }
```

The module's responsibility is simple: it evokes the sentiment function with the event details and returns the result.

For a better understanding of what's _actually_ happening, let's examine the getSentiment declaration.

_src/getSentiment:_

```typescript
import AWS from 'aws-sdk'

export const getSentiment = () => {
  const params = {
    LanguageCode: 'en',
    TextList: ['I hate this'],
  }

  const comprehend = new AWS.Comprehend({
    apiVersion: '2017-11-27',
    region: 'us-east-1',
  })

  return comprehend.batchDetectSentiment(params).promise()
}
```

As we see in the file, we're importing the AWS sdk to utilize its services in our application. Specifically, we're consuming the Comprehend API. If you're not familiar, think of it as Amazon's ML-as-a-service, with it offering APIs for sentiment analysis and natural language processing.

Now that we've implemented the core logic of our application, it's time to run them against the tests that we wrote earlier. If everything goes well, they should all pass.

Hooray, looks like we're in good shape. Time to focus our attention toward the CI/CD layer.

### Hooking Into a Build Process

There are several options in the market for implementing a CI/CD pipeline, and they've edged closer to feature parity among most of them. Among the options include:

- CircleCI
- Travis
- Buddy (?)

None dominate the market, however, like Jenkins<link>. And, while it might not be the edgiest contestant in the field, it's something the average developer will undoubtedly run into at work and thus deserves a good understanding.

The downside of Jenkins is that it's not a hosted service. Rather, users are expected to install and host the application on their own hardware. Since I've already committed to learning more about Jenkins, the next step is getting my infrastructure established in the cloud.

For this project, I'm going to run a Jenkins server in a Docker container on an EC2 instance on Amazon Web Services (AWS). There are admittedly countless permutations of different stacks and services I could've chosen to host this service. Ultimately, I chose the Docker route because Jenkins provides the images. This seemed easier than writing or following a script that had me install Java, Jenkins, and other utilities from scratch. I also chose an EC2 instance instead of a more integrated service like ECS or EKS for two reasons:

1. I'll only need one build server, so task definitions and services felt like overkill
2. Keeping it on a VPS with Docker installed is easily repeatable across cloud providers

Let's dive in.

_Note: If you're following along, you'll want to <link>create an AWS account</link> for this next part of the article._

### Creating the EC2 Instance

First, log onto the AWS Console and navigate to the EC2 dashboard. There, you should be able to launch a new instance.

<screen></screen>

The wizard will walk you through creating a new instance. Below are the details for each section.

1. Instance Type

- Select XXXX size. This is due to an issue with Jest \*explain how jest is a resource hog.
- walk through creating security group with inbound rules necessary
- launch the instance

Cool, we're now ready to ssh into the server and install Docker. Here are the <link>blessed steps</link> to installing.

- link to docker images available
- recap of the process (creating the network, running the containers)
- fetching the link from the cli, sneak of exec
- link to common docker cli usage (?) or steps to learn more about it (?)
- github integration

- final step would be creating a new implementation

  - implementing actual reading from the filesystem in a final section, pushing and watching the build succeed/lambda update!

- in closing
  - links for more info
