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

Let's start this project by writing tests that explain what we'd _like_ to accomplish and then implement logic that gets them to pass. To many, this is the heart of <b>Test-Driven Development, or TDD</b>. It's also a methodology I've slowly adopted over the course of the last few months, and I don't see myself straying from its noble path anytime soon.

Since our deploy target is a lambda function, my app's entrypoint will need to be a file with an exported handler function. I'll keep this in mind as I generate the first file I'll need for the project, _src/**tests**/index.test.ts_:

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

As we see in the file, we're importing the AWS sdk to utilize its services in our application. Specifically, we're consuming the Comprehend API. If you're not familiar, think of it as Amazon's ML-as-a-service, with it offering APIs for sentiment analysis and other natural lannguage processing.

Now that we've implemented the core logic of our application, it's time to run them against the tests that we wrote earlier. If everything goes well, they should all pass.

### Hooking Into a Build Process
