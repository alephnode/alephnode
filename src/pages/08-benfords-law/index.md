---
title: "Visualizing Benford's Law with D3 and Observable"
date: '2019-03-25'
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

When it comes to pop culture's emanating spotlight, most photons land on the normal distribution when it comes to statistical models. This is fair; it uncovers the relationships underlying much of the world around us. Patterns in datasets relating to science, economics, and other areas of study are better identified and predicted as a result of this magical formula.

About 75 years after the bell curve was published by Carl Friedrich Gauss, another theorist made an intriguing observation: the occurrence of natural numbers in large datasets doesn't follow this pattern.

<div id="img-container">
<img id="benford-img" src="./images/benford_example.png">
<div class="src-container"><span class="source">Example distribution following Benford's law</span></div>
</div>

- if newcomb found it, why tf is it named Benford?

### The Project

To get started, create a new notebook from the dashboard and give it a name.

My example dataset (spoiler alert, I know it meets the law) is the Top 5000 YouTube dataset via <a href="https://www.kaggle.com/mdhrumil/top-5000-youtube-channels-data-from-socialblade" target="_blank">Kaggle</a>.

Our first order of business is requiring d3, which we'll use to visualize the dataset.

```javascript
d3 = require('d3@5')
```

_Note that the variable type declaration isn't required in an Observable notebook. Alos, because the convention for many notebooks is to lead with the most important information at the top and cascade down, I'm going to add each new cell above the previous one._

In a new cell, we'll pull in the dataset for the project:

```javascript
data = d3.csv('https://s3-us-west-2.amazonaws.com/alphnode-benfords-law-youtube-channel-stats/data.csv')
```

After examining the dataset, I see that the subscribers for each YouTube channel seems to fit the requirements for adhering to Benford's law: large set of numbers that don't have an obvious maxima or anything that would cap/skew the set.

To get a better sense of the leading digits, I'll write a function that filters through the list, keeping only the cells where the number passed in is the first.

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

- rosetta code or whatever (also learn the word masechtomy while you're there)
- intro observable 
- benfords law page

As always, thanks for reading!
