---
title: 'How Websites Happen, Part Two: Optimizing Performance'
date: '2019-02-10'
---

In the <a href="/05-treading-critical-rendering" target="_blank">previous post</a>, I walked through the details of the critical rendering path. It explained the process an HTML file goes through from being received by the browser all the way to its visualization on the page.

For the second half of this topic, I'll focus on ways developers can reduce the time and cost associated with these steps, making for a more performant, enjoyable user experience as a result.

To better illustrate the ideas expressed, I'll walk through creating a simple SPA in vanilla JavaScript.

You can see the demo app here, or view/clone the source on GitHub and skip the next section if you're here only for the performance tips.

Alright, let's get started!

### Building the Site

Before we can optimize the performance of a site, we need a site (!). Luckily, I've prepared a basic project for us to work with.

The repository for this project provides two examples: one basic site, and the same site optimized. Because the project is relatively straightforward (mostly web component declarations), I'll only walk through the core modules before explaining the optimization steps.

### Code Splitting

### Tree Shaking

### Service Worker

### Manifest.json, a11y
