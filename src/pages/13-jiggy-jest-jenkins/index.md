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

### Repo Walkthrough

Since our deploy target is a lambda function, my app's entrypoint will need to be a file with an exported handler function. That's what we'll find in _src/index.ts_:

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
