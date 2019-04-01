---
title: "Visualizing Benford's Law with D3 and Observable"
date: '2019-03-29'
---

<div id="img-container">
<img id="stats-img" src="./images/stats.jpg">
<div class="src-container"><span class="source">Photo by Chris Liverani on Unsplash</span></div>
</div>

During my stint as a journalist, my interests floated toward data visualization and visual storytelling. To me, a dense, detailed graphic could convey information just as efficiently as a write-up.

Given that a recent goal was to experiment with creating graphics on the web, I naturally gravitated toward <a href="https://d3js.org/" target="_blank">d3.js</a>. It's been a popular visualization library for years and has scores of tutorials online.

It was through d3's homepage that I discovered Observable, a new site that enables users to publish self-contained collections of markdown, visualizations, or whatever the heart desires.

### What is Observable?

What makes an Observable notebook intriguing is how you can run snippets of JavaScript code in a series, similar to the popular Jupyter Notebook software from the world of Python.

The documentation for the service does an excellent job introducing the concept with simple examples, so I'd recommend visiting the page for a more thorough introduction.

For now, I'm interested in experimenting with Observable through exploring one of my favorite topics in Math: Benford's Law.

You can find the notebook associated with this article <a href="https://observablehq.com/@alephnode/benfords-law-top-5000-youtube-channels-edition" target="_blank">here</a>, or keep reading for a walkthrough on creating the visualization.

Before we jump in, it's worth summarizing Benford's law for the unfamiliar.

### Benford's Law: Description, Backstory

When it comes to statistical models, no formula comes close to the popularity and prevalance of the normal distribution.

This is fair; it uncovers the relationships underlying much of the world around us. Patterns in datasets relating to science, economics, and other areas of study are better identified and predicted as a result of this versatile formula.

About 75 years after the bell curve was published by Carl Friedrich Gauss, another theorist noticed an intriguing pattern: the occurrence of natural numbers in large datasets doesn't follow this formula.

<div id="img-container">
<img id="benford-img" src="./images/benford_example.png">
<div class="src-container"><span class="source">Example distribution following Benford's law</span></div>
</div>

In 1881, the Canadian-American mathematician Simon Newcomb observed that the natural numbers appeard in a descending order of commonality (starting at 1) as the first instance of a number. This led him to publish ""Note on the Frequency of Use of the Different Digits in Natural Numbers."

Although Newcomb was the first to observe this pattern, it wasn't until Frank Benford presented a clear formula and several examples in "The Law of Anomalous Numbers" in 1938 that the law took shape.

Today, Benford's law is used across disciplines to check, among other things, the validity of datasets and the prevention of fraud.

### The Project

Now that we understand a little more about Benford's law, let's find an example of it hiding in a large dataset.

I'll start by creating a new notebook from the Observable dashboard.

I'm going to use the Top 5000 YouTube dataset via <a href="https://www.kaggle.com/mdhrumil/top-5000-youtube-channels-data-from-socialblade" target="_blank">Kaggle</a> for this project.

The first order of business is requiring d3, which I'll use to visualize the dataset.

```javascript
d3 = require('d3@5')
```

_Note that the variable type declaration isn't required in an Observable notebook. Also, because the convention for many notebooks is to lead with the most important information at the top and cascade down, I'm going to add each new cell above the previous one._

In a new cell, we'll pull in the dataset for the project:

```javascript
data = d3.csv(
  'https://s3-us-west-2.amazonaws.com/alphnode-benfords-law-youtube-channel-stats/data.csv'
)
```

After examining the dataset, I see that the subscription counts for each YouTube channel seem to adhere to Benford's law: a large set of numbers that don't have an obvious minima/maxima or anything that would cap/skew the set.

To get a better sense of the first number of each subscription count, I'll write a function that filters through the list, keeping only the cells where the number passed in is the first.

```javascript
getLeadingDigitCount = n =>
  data.filter(d => parseInt(d['Subscribers'][0]) === n).length
```

Next, I pass each number, 1-9, into the function and store the resulting array into a variable called _counts_:

```javascript
counts = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({
  name: n,
  count: getLeadingDigitCount(n),
}))
```

Alright, time for the heavy lifting: defining our chart.

```javascript
chart = {

  let margin = ({top: 20, right: 0, bottom: 50, left: 35});
  let width = 900;
  let  height = 600;

  let y = d3.scaleLinear()
    .domain([0, d3.max(counts, d => d.count)]).nice()
    .range([height - margin.bottom, margin.top]);

  let x = d3.scaleBand()
    .domain(counts.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  const svg = d3.select(DOM.svg(width, height));

  svg.append("g")
      .attr("fill", "#FAE03C")
    .selectAll("rect")
    .data(counts)
    .join("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.count))
      .attr("height", d => y(0) - y(d.count))
    .attr("width", x.bandwidth());
  svg.append("g")
      .call(xAxis);
  svg.append("g")
      .call(yAxis);

  return svg.node();
}
```

There's a lot to unpack here. First, we define some values for presenting the graph: margin, width, and height.

### Wrapping Up

As illustrated above, Observable provides an excellent environment for presenting or exploring datasets on the fly with little to no setup required.

Here are a few additional resources if this topic piqued your interest:

- <a href="http://www.ams.org/publicoutreach/feature-column/fcarc-newcomb" target="_blank">Reference: American Mathematical Society Article on Benford's Law</a>
- <a href="https://rosettacode.org/wiki/Benford%27s_law" target="_blank">Benford's Law - Rosetta Code Implementations</a>
- <a href="https://observablehq.com/@observablehq/five-minute-introduction" target="_blank">Observable - Five Minute Introduction</a>
- <a href="https://www.youtube.com/watch?v=XXjlR2OK1kM" target="_blank">Number 1 and Benford's Law - Numberphile</a>
- <a href="http://testingbenfordslaw.com/" target="_blank">Testing Benford's Law</a>

As always, thanks for reading!
