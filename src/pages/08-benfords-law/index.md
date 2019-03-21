---
title: "Visualizing Benford's Law with D3 and Observable"
date: '2019-03-16'
---

<div id="img-container">
<img id="stats-img" src="./images/stats.jpg">
<div class="src-container"><span class="source">Photo by Chris Liverani on Unsplash</span></div>
</div>

During my stint as a journalist, my interests floated toward data visualization and visual storytelling. To me, a dense, detailed graphic could convey information just as efficiently as a verbose write-up.

Given that a recent goal was to experiment with creating graphics on the web, I naturally gravitated toward <a href="https://d3js.org/" target="_blank">d3.js</a>. It's been a popular visualization library for years and has loads of experience supporting other languages.

It was through that library's documentation that I discovered Observable and was able to build out a few ideas in little time.

### What is Observable?

An Observable notebook is an application that lets you run snippets of contained JavaScript code in a series, similar to the popular Jupyter Notebook software from Python land.

The documentation for the service does an excellent job introducing the concept with simple examples, so I'd recommend visiting the page for a more thorough introduction.

For now, I'm interested in experimenting with Observable through exploring one of my favorite topics in Math: Benford's Law.

### Some Backstory

When it comes to pop culture's emanating spotlight, most photons land on the normal distribution. This is fair; it uncovers the relationships underlying much of the world around us. Patterns in datasets relating to science, economics, and other areas of study are better identified and predicted as a result of this magical formula.

About 75 years after the bell curve was published by Carl Friedrich Gauss, another theorist made an intriguing observation: the occurrence of natural numbers in large datasets doesn't follow this pattern.

<div id="img-container">
<img id="benford-img" src="./images/benford_example.png">
<div class="src-container"><span class="source">Example distribution following Benford's law</span></div>
</div>

- if newcomb found it, why tf is it named Benford?

### The Law

- example of its use -

### Wrapping up

- rosetta code or whatever (also learn the word masechtomy while you're there)

uber dataset:

https://movement.uber.com/explore/los_angeles/travel-times/charts?lang=en-US&si=1380&ti=&ag=censustracts&dt[tpb]=ALL_DAY&dt[wd;]=1,2,3,4,5,6,7&dt[dr][sd]=2018-01-01&dt[dr][ed]=2018-01-31&cd=&sa;=&sdn=&lat.=34.0522342&lng.=-118.2846849&z.=12

grab first digit of number: parseInt((''+n)[0]);

https://jsperf.com/get-second-digit (make own with first digit inspired by or just link to)

algorithm in Observable:

- load in dataset
- convert the distance traveled row to first digit only
- graph with it as a bar chart
