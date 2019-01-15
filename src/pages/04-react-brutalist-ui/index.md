---
title: 'Creating a Reusable Brutalist React Componenet Library with Storybook'
date: '2019-01-20'
---

Why Storybook? After building a few separate UI libs from scratch, I know it gives me the layout, look, and features I want while saving time. Plus, it's trusted by companies like airbnb, coursera, and Slack, so I know it's battle tested.

One of the best pieces of advice I've found when crafting a component library comes from Cory House's <a href="https://www.pluralsight.com/courses/react-creating-reusable-components" target="_blank">PluralSight course</a> (paywall). In it, he describes the numerous decisions one makes when implementing a component library.

- SO MANY DECISIONS TO MAKE, EXPLAIN HERE \*

_This article assumes a basic understanding of React, Node, and Yarn workflows. Refer to their respective documentation/getting started guides if you need a refresher before continuing._

To get started, I create the project's directory and initialize it with a bare _package.json_ file.

Next, initialize Storybook using their cli. I'm using npx so I don't have to install globally:

```bash
λ npx -p @storybook/cli sb init
```

// This might not be true, wifi could just suck at mothership
_Note: if you try initializing storybook before creating a package.json file, it'll spit an ugly error._

Storybook should detect that we're using React and initialize a bare proect for us. When the command is finished executing, you can test that everything works by running:

```bash
λ yarn storybook
```

If everything worked, you should see a basic template with an example button component, like so:

<img src="images/storybook-init.png">

<br/>

For more helpful resources, check out:

- <a href="https://www.learnstorybook.com/" target="_blank">Learn Storybook</a>
