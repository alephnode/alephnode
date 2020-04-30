---
title: 'Getting Jiggy with Jenkins and Jest, Part One'
date: '2020-04-06'
---

A few months have passed since my last article. Rest assured that the time was not spent in idle; I was busy tending to a new home and new role.

I've also had to shift my focus on the endless vista of JavaScript topics. Whereas the brunt of last year's work involved front-end concerns like rendering virtual lists and optimizing bundle performance, my time lately has been spent supporting JavaScript-based microservices at scale. As a result, the next few articles will reflect the resulting learnings and investigations.

At the core of this professions growth is the single-most important change I've made: adhering to a test-driven development pattern.

I know what you're thinking: I'm one of those assholes that writes about obvious best practices that'll look good on my resume.

And, to level with you, that's the world I wish we _actually_ lived in. I relish the thought of stating the obvious when discussing thorough testing and the modular, cohesive code that derives from it.

Instead, we devs often inherit code that has sparse—if _any_—test coverage. Even if there are tests, they're not wired to a CI/CD pipeline that defends your builds from buggy code.

So I have to be the guy who writes about test-driven development (which will look good on my resume).

Let's examine the benefits.

### Seriously, Why TDD

=============== PROJECT CODE SECTION START ===============

Alright, let's jump into the project.

### High-Level Project Overview

Before we start, have a look at the tree structure for the project:

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

Let's also inspect the _package.json_ file to see what's installed:

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

Not much to include with this project aside from the AWS SDK, Jest as my test suite (more on that in a minute), and project-specific utilities (config presets and the types for our external libraries). Oh, and nodemon for the dev server.

It's worth popping open _jest.config.js_ to see how our project's test suite will behave.

_jest.config.js_:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src', 'dist'],
  collectCoverage: true,
}
```

Nothing controversial being done here. I'm including a preset for Jest so it knows I'm using TypeScript, and also specifying my root directories and test environment. For more info on configuring Jest, check out the project's thorough <a href="https://jestjs.io/docs/en/configuration" target="_blank">documentation</a>.

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

Note that Jest provides test running methods as well as assertion functions out of the gate. This is convenient for those who don't want to import a library at the top or download two separate libs for test handling (I'm looking at you, `mocha` and `chai`). It's conveniences such as this, as well as it auto-mocking third-party dependencies, that make it my go-to testing suite for JS projects.

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

Again, we use some Jest-specific functions for describing our tests, breaking them into separate units, and asserting the value of the functions we're testing. One thing to note is that each test written can be expressed as having three distinct sections:

- <strong>arranging </strong>the data and functions needed
- <strong>acting</strong>, or performing the operation being tested, and
- <strong>asserting</strong> the expected value or effect of the operation

This is considered the AAA pattern and is common in the TDD community. Check out an <a href="https://docs.microsoft.com/en-us/visualstudio/test/unit-test-basics?view=vs-2019" target="_blank">exploration of the concept</a> if you're curious.

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

The module's responsibility is simple: it invokes the sentiment function with the event details and returns the result.

For a better understanding of what's _actually_ happening, and through the looking glass of our test-first approach, let's examine the getSentiment test file.

_src\/\_\_tests\_\_\/getSentiment.test.ts:_

```typescript
import { getSentiment } from '../getSentiment'
import expectedResponse from '../__mocks__/mockAWSResponse'

describe('Index tests', () => {
  it('responds with expected string with valid params', async () => {
    const res = await getSentiment()
    expect(res).toEqual(expectedResponse)
  })
})
```

In the test, we invoke the `getSentiment` function, which reaches out to AWS (currently with static sample text hard-coded in the function) to receive a sentiment score. We then compare the result with the predefined response we expect back.

Digging into the mock file will give us a better sense of what we expect.

_src\/\_\_mocks\_\_\/mockAWSResonpse.ts:_

```typescript
export default {
  ErrorList: [],
  ResultList: [
    {
      Index: 0,
      Sentiment: 'NEGATIVE',
      SentimentScore: {
        Mixed: 8.582701980230922e-7,
        Negative: 0.9986988306045532,
        Neutral: 0.001219981350004673,
        Positive: 0.00008040780085138977,
      },
    },
  ],
}
```

Clearly whatever I'm sending at the moment is a negative sentiment. We'll have to fix that.

Alright, enough suspense. Here's the _actual_ implementation.

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

Quite the sentiment, indeed. I'd say our natural language processing is doing just fine.

As we see in the file, we're importing the AWS SDK to use Comprehend in the service. Specifically, we use the promisified versoion of its `batchDetectSentiment` method, which will inspect a batch of documents and respond with a sentiment score. Once we receive the response, we relay it upstream.

Now that we've seen the core logic of the application, it's time to run the tests we saw earlier. If everything goes well, they should all pass.

- NOTE: when setting up the lambda, you have to grant the lambda Comprehend permission. I do full access
- https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf (excellent jenkins build server)
