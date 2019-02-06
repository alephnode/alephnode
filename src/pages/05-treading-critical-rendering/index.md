---
title: 'How Websites Happen: Treading the Critical Rendering Path'
date: '2019-02-07'
---

Looking back, it surprises me how deeply I delved into web development without knowing how browsers _actually_ present websites.

Don't get me wrong--I had a general idea of the process: the static HTML file is requested and received, scripts and styles are loaded, and the JavaScript included on the page enables interaction without reload.

Having worked at a startup for a few years, I prioritized learning how to configure servers and networks, which gave me the (false) impression that my mental model for the web delivery process was fully formed.

It reminds me of the knowledge graph published by <a href="http://bradfrost.com/blog/post/atomic-web-design/" target="_blank">Atomic Design</a> creator Brad Frost:

<div id="img-container">
<img id="knowledge-img" src="./images/frost-knowledge.jpg">
<div class="src-container"><span class="source"><i>source: http://bradfrost.com/blog/post/i-have-no-idea-what-the-hell-i-am-doing/attachment/knowledge-graph/</i></span></div>
</div>

Although the aforementioned topic set provides enough working knowledge to successfully launch a site or deliver an MVP, it falls short of the comprehension that can make all the difference in an increasingly <a href="https://en.wikipedia.org/wiki/Time_to_first_byte" target="_blank">TTFB</a>-worshipping market, or for anyone who aims to optimize performance.

Because this blog is concerned with gathering knowledge and passing it along, what follows is a walkthrough of the steps taken by browsers to present sites like the one you're reading right now, better known as the <b>critical rendering path</b>.

_Note: While there are several steps before displaying a resource online, this post will focus solely on content presentation, starting with the browser getting a fresh HTML file to render._

### Step One: The DOM Tree

On the journey that is the CRP, the trailhead is commonly a newly gifted HTML file from some server on the web.

Upon receiving this asset, the first thing the browser does is build the DOM tree, or the object representation of the file's contents.

This involves parsing the resource line by line, looking for and converting keywords it recognizes into nodes in its tree (known as tokenizing) along the way.

### Step Two: Generating the CSSOM for Styles

- Browser receives, begins parsing HTML document from server
- Converts the tags it encounters into tokens, which convert into nodes that form the DOM
- Browser requests assets, styles, and javascript
- CSS files are received, render-blocking (!) and the CSSOM is constructed
  - Even when JS files are received, execution is paused before CSSOM is constructed
  - Logic is that JS could manipulate the DOM and will be necessary for paint process
- Any JavaScript received is executed
- the DOM and CSSOM merge to form the render tree
- The layout step occurs, where hierarchy is established
- the paint request is issued and the content is visible on the screen to the end user

### The Road Ahead

For more helpful resources on the subject, check out the following links.

- <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/" target="_blank">Google Web Fundamentals: Critical Rendering Path</a>
- <a href="https://bitsofco.de/understanding-the-critical-rendering-path/" target="_blank">Bits of Code: Understanding the Critical Rendering Path</a>
- <a href="https://medium.freecodecamp.org/an-introduction-to-web-performance-and-the-critical-rendering-path-ce1fb5029494" target="_blank">An introduction to Web Performance and the Critical Rendering Path</a>

As always, thanks for reading.
