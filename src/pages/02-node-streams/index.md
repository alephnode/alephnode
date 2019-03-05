---
title: The Tranquility of Streams in Node
date: '2019-01-02'
---

<div id="img-container">
<img id="streams-img" src="./images/streams-article.jpg">
<div class="src-container"><span class="source">Photo by Karim Sakhibgareev on Unsplash</span></div>
</div>

It's common for me to make changes to a dataset before using it elsewhere.

One example would be generating reports from log files for internal dashboards and tooling. To keep the hypothetical scenario simple, let's say I just need to convert a UNIX timestamp into a human-readable date and pass it via API. Because log files are usually quite large, Node's core streams module will prove useful.

Streams in Node are abstractions that transform monolithic data sources into a mercurial flow of information, performing tasks in a series rather than one operation. Like conveyor belts at airport service counters, they enable programs to send data (or luggage) from one place to another without having to carry the load in one trip.

### The Essence of Streams

Streams have well-defined, "readable" _sources_, and separate _destinations_, which are "writable". If we want to establish a connection between some specific source and destination pair (like TCP connections or cryptographic operations), we create a "duplex". Duplexes that manipulate the stream of data along its journey are called "transforms". (Think middleware or webhooks, but for data.)

Because only segments of data are loaded into memory rather than all at once, streams provide a noticeable performance increase over other methods. Data is also processed sooner, helping to cut time even more. A detailed breakdown of performance and the additional benefits (using the event stream library) can be found <a href="https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33" target="_blank">in this stellar write-up</a>.

Let's apply what we've learned so far to the problem posed earlier: converting dates in a given dataset.

Our example dataset, _posts.json_, is a basic array of posts:

_posts.json:_

```json
//posts.json
[
  {
    "userId": 1,
    "id": 1,
    "timestamp": 1514775813,
    "title": "sunt aut facere repellat provident
    occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit
    recusandae consequuntur expedita et cum\nreprehender
    it molestiae ut ut quas totam\nnostrum rerum est
    autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "timestamp": 1523103120,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi
    sint nihil reprehenderit dolor beatae ea dolores
     neque\nfugiat blanditiis voluptate porro vel
     nihil molestiae ut reiciendis\nqui aperiam non
     debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "timestamp": 1523103120,
    "title": "ea molestias quasi exercitationem
    repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem
    occaecati omnis eligendi aut ad\nvoluptatem
    doloribus vel accusantium quis pariatur\nmolestiae
     porro eius odio et labore et velit aut"
  }
]
```

First, let's write a function that performs the conversion:

_convertDate.js:_

```javascript
const convertDate = timestamp => {
  const date = new Date(timestamp * 1000) //convert timestamp to milliseconds

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = `0${date.getMinutes()}`
  const seconds = `0${date.getSeconds()}`

  return `${month}/${day}/${year} ${hours}:${minutes.substr(
    -2
  )}:${seconds.substr(-2)}`
}

module.exports = convertDate
```

_Keep in mind this is meant to be a trivial example. Depending on build tools and product needs, I could always pull in a library to do the above._

Next, let's define the transform that'll apply this function to our data.

_dateConverter.js:_

```javascript
const { Transform } = require('stream')
const convertDate = require('./convertDate')

const dateConverter = new Transform({
  transform(chunk, _, cb) {
    let r = JSON.parse(chunk.toString())
    r.forEach(e => (e.timestamp = convertDate(e.timestamp)))
    this.push(JSON.stringify(r))
    cb()
  },
})

module.exports = dateConverter
```

Let's dig deeper. Our export, <b>dateConverter</b>, is a new Transform instance (from the stream library) where we define our desired function. We first parse the chunk to provide us with the JSON object. We then loop through the response, switching each element's timestamp to the preferred format along the way. We then push the data and trigger the callback.

Finally, define the index file where we run our script:

_index.js:_

```javascript
//require our modules
const fs = require('fs')
const dateConverter = require('./dateConverter')

//define our read/write streams
const src = fs.createReadStream('./posts.json')
const dst = fs.createWriteStream('./posts-clean.json')

//set the object mode to true
src.objectMode = true

//pipe our src into our transform function, then ultimately to its destination
src.pipe(dateConverter).pipe(dst)
```

Once we run our script, we see our new posts-clean.json file with the updated timestamp:

_posts-clean.json:_

```json
[
  {
    "userId": 1,
    "id": 1,
    "timestamp": "12/31/2017 19:03:33",
    "title": "sunt aut facere repellat provident
    occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae
    consequuntur expedita et cum\n
    reprehenderit molestiae ut ut quas totam\nnostrum
    rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "timestamp": "4/7/2018 5:12:00",
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil
    reprehenderit dolor beatae
    ea dolores neque\nfugiat blanditiis voluptate porro
     vel nihil molestiae ut reiciendis
    \nqui aperiam non debitis possimus qui
    neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "timestamp": "4/7/2018 5:12:00",
    "title": "ea molestias quasi exercitationem
    repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem
    occaecati omnis eligendi aut ad
    \nvoluptatem doloribus vel accusantium quis
     pariatur\nmolestiae porro eius
     odio et labore et velit aut"
  }
]
```

I hope this helped introduce the topic of node streams in a concise, practical way. For more excellent resources on this topic, check out the following articles/references:

- <a href="https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93" target="_blank">Node.js Streams: Everything you need to know</a> _by Samer Buna_
- <a href="https://codeburst.io/nodejs-streams-demystified-e0b583f0005" target="_blank">Nodejs Streams {Demystified}</a> _by Akshit Grover_
- <a href="https://nodejs.org/api/stream.html" target="_blank">Node.js Stream API Reference</a>
