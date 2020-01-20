---
title: 'Getting Jiggy with Jest and Jenkins'
date: '2020-01-12'
---

OK, we'll do it this way. Intro will present itself once other parts are more fleshed out, personal touches are considered. For now, let's create an outline.

- Importance of testing, emphasis on code you inherit. Make comparison of reason, too. Constantly be challenging assumptions while allowing them to establish a foundation for critical thought.

- Stack of choice. Test and CICD, importance of both
- also explain example project, TDD approach taken
- walk through project !
- pick a domain/deployment TARGET
- hook it up to jenkins
- find a way to wrap it up in a cool way
- conclusion, referral to books
- NOTE: when settinng up the lambda, you have to grant the lambda Comprehend permission. I do full access
- https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf (excellent jenkins build server)

## AWS Comprehend Section

### Tests First

Rather than the results-first flow of previous articles on this site, we're going to incrementally build the project with tests that explain what we'd _like_ to accomplish and then implement logic that gets them to pass. To many, this is the heart of <b>Test-Driven Development, or TDD</b>. It's also a methodology I've practiced regularly over the last few months, and I don't plan to stray from its noble path anytime soon.

Because this project involves compilation steps, test suite configuration, a CI/CD layer, and deployment scripts, there's quite a bit that could go wrong from development to release. For this reason, I generally include a canary endpoint/module in these types of projects that serve as a base case. I name these files _sanity.\*_ because, as the name implies, they exist solely for me to troubleshoot individual pieces incrementally if anything goes wrong.

Implementing my canary module will start with a test. Because the purpose is for the file to be simple, I'll test that the sanity module simply returns a "Hello, World!" response.

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

Note that Jest provides test running methods as well as assertion methods out of the gate. This is convenient for those who don't want to import a library at the top or download two separate ones to handle testing (I'm looking at you, `mocha` and `chai`).

Since our deploy target is a lambda function, my app's entrypoint will need to be a file with an exported handler function. Let's start with writing the test file for this module.

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

Again, we use some Jest-specific syntax for describing our tests, breaking them into separate units, and asserting the value of the functions we're testing.

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
