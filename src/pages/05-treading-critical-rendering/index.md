---
title: 'How Websites Happen: Treading the Critical Rendering Path'
date: '2019-02-07'
---

Looking back, it surprises me how deeply I delved into web development without knowing how browsers _actually_ work.

Don't get me wrong--I had a general idea of the process: the static HTML file is requested and received, scripts and styles are loaded, and the JavaScript included on the page enables interaction without reload.

Having worked at a startup for a few years, I prioritized learning how to configure servers and networks, which gave me the (false) impression that my mental model for the web delivery process was fully formed.

It reminds me of the knowledge graph published by <a href="http://bradfrost.com/blog/post/atomic-web-design/" target="_blank">Atomic Design</a> creator Brad Frost:

<div id="img-container">
<img id="knowledge-img" src="./images/frost-knowledge.jpg">
<div class="src-container"><span class="source"><i>source: http://bradfrost.com/blog/post/i-have-no-idea-what-the-hell-i-am-doing/attachment/knowledge-graph/</i></span></div>
</div>

Although the mentioned topics provide enough working knowledge to successfully launch a site or deliver an MVP, they fall short of the understanding that stands out in an increasingly <a href="https://en.wikipedia.org/wiki/Time_to_first_byte" target="_blank">TTFB</a>-worshipping market, or for anyone who aims to optimize performance.

Because this blog is concerned with gathering knowledge and passing it along, what follows is a rundown of how browsers present sites like this, better known as the <b>critical rendering path</b>.

_Note: While there are several steps before a page is displayed online, this post will focus solely on how the browsers present content, starting with a fresh HTML file to render._

### Step One: Creating the DOM and CSSOM Trees

On the journey that is the CRP, the trailhead is (usually) an HTML file from some server on the web.

Upon receiving this asset, the first thing the browser does is build the DOM tree, or its own representation of the file's contents.

This involves parsing the resource line by line, tagging keywords it recognizes and converting them into nodes in a tree (processes known as tokenizing and lexing, respectively) along the way.

Once the DOM object is created, the browser needs to gather the object's style properties before rendering it. This is where CSSOM comes into play.

Most websites have styles associated with their markup. When the browser encounters a linked stylesheet or other asset, it sends the request for that item and is blocked from rendering the page until the asset is available. This is why CSS is commonly referred to as <b>render-blocking</b>.

If you think about it, this makes sense. The browser is aware that styles matter to the rendering process ahead, and it needs to interrpret the information received as a whole due to the cascading nature of styles.

After styles are loaded, the JavaScript fetched by the browser is finally able to run.

### Step Two: JavaScript Execution

With the DOM constructed and styles identified, any JavaScript referenced is executed for the page, modifying the content, styles, and other information it needs to properly display the resource.

### Step Three: Scaling the Render Tree

### Step Four: Assessing the Layout

### Step Five: Time to Paint

### Bringing It All Together

### Performance - Up Next

Now that we better understand the process for delivering content on the web, it's worth focusing on opportunities for optimization and enhancement.

In a follow-up post, I'll demonstrate a few best practices when building the modern web with a simple web application in vanilla JavaScript.

For more helpful resources on the subject, check out the following links.

- <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/" target="_blank">Google Web Fundamentals: Critical Rendering Path</a>
- <a href="https://bitsofco.de/understanding-the-critical-rendering-path/" target="_blank">Bits of Code: Understanding the Critical Rendering Path</a>
- <a href="https://medium.freecodecamp.org/an-introduction-to-web-performance-and-the-critical-rendering-path-ce1fb5029494" target="_blank">An introduction to Web Performance and the Critical Rendering Path</a>

As always, thanks for reading.

Remaining Topics

- the DOM and CSSOM merge to form the render tree
- The layout step occurs, where hierarchy is established
- the paint request is issued and the content is visible on the screen to the end user
