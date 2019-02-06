---
title: 'Treading the Critical Rendering Path'
date: '2019-02-07'
---

Looking back, it surprises me how deeply I delved into web development without knowing how browsers _actually_ work.

Don't get me wrong--I had a general idea of the basic process: the static html file is requested and received, scripts and styles are loaded, and the JavaScript on the page enables interaction long after initial render.

Although this is enough working knowledge to successfully launch a site or deliver an MVP, it falls well short of the command of the material that can make all the difference in an increasingly <a href="https://en.wikipedia.org/wiki/Time_to_first_byte" target="_blank">TTFB</a>-worshipping market.

It reminds me of the knowledge graph published by <a href="http://bradfrost.com/blog/post/atomic-web-design/" target="_blank">Atomic Design</a> creator Brad Frost:

<div id="img-container">
<img id="knowledge-img" src="./images/frost-knowledge.jpg">
<div class="src-container"><span class="source"><i>source: http://bradfrost.com/blog/post/i-have-no-idea-what-the-hell-i-am-doing/attachment/knowledge-graph/</i></span></div>
</div>

### The Critical Rendering Path, Explained

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

Hopefully this article was informative enough to provide information you didn't already know about the critical rendering path. For more helpful resources on the subject, check out the following links.

- <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/" target="_blank">Google Web Fundamentals: Critical Rendering Path</a>
- <a href="https://css-tricks.com/understanding-critical-rendering-path/" target="_blank">CSS Tricks: Understanding the Critical Rendering Path</a>
- <a href="https://medium.freecodecamp.org/an-introduction-to-web-performance-and-the-critical-rendering-path-ce1fb5029494" target="_blank">An introduction to Web Performance and the Critical Rendering Path</a>

As always, thanks for reading.
