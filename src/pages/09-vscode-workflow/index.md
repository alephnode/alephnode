---
title: 'Powering up Your Workflow with Visual Studio Code'
date: '2019-06-01'
---

<div id="img-container">
<img id="stats-img" src="./images/vs.png">
</div>

Hello again, everyone!

If you're like me, you're constantly looking for ways to improve the development experience. From faster compilation to terminal aliases, anything that cuts precious time is worth considering. What follows are a few of my favorite tricks available in my IDE of choice.

### Wait, Why VSCode? (In Case You Need Convincing)

Although there are several notable IDEs to choose from, VSCode is the only one that bundles everything I want into one cohesive, community-backed unit. Among its many benefits are:

- <strong>Excellent support</strong>. With more than 890 contributors and 77,000 stars as of this writing, you know the project is well-maintained.
- <strong>Written in JavaScript</strong>. Given that I'm primarily a JS developer, it's inspiring to work with software that's written in my preferred language.
- <strong>Open Source</strong>. Microsoft took one of its flagship products and offered an open-source flavor of it for developers across the world. The fact that you can take a look under the hood at your leisure is a cool added benefit to the project.
- <strong>Strong IntelliSense</strong>: From code completion to class introspection, VSCode's IntelliSense constantly saves me from having to double-check references to properties, function signatures, and other cross-module relations.
- <strong>Fantastic git integration</strong>: Its out-of-the-box conflict resolution viewer has removed my need for a standalone version control app altogether.

Granted, many editors offer the same benefits listed above. If you're happy with your current IDE, approach this article as offering suggestions for tools and extensions you should look for in your existing app.

Alright, onto the good stuff: a few of the best features available for the product.

### Section One: Cool Extensions

With more than <a href="https://marketplace.visualstudio.com/search?target=VSCode&category=All%20categories&sortBy=Downloads" target="_blank">11,000 extensions available</a>, the VSCode marketplace is as robust as it is overwhelming. To help narrow the choices down, here's a list of some that I use daily:

#### <a href="https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens" target="_blank">GitLens</a>

A coworker showed me this and I haven't turned back since. In short, this extension brings a wealth of versioning information to your fingertips. It allows you to view file and line history, compare your current branch with others, search the commit history, and perform numerous other actions to help examine your codebase.

#### <a href="https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker" target="_blank">Code Spell Checker</a>

If you're like me, you constantly flub the spelling of your variables and function names when writing code. With the Code Spell Checker extension, misspelled or unfamiliar words receive green squiggly lines under them until you either correct the blunder or add the word to your workspace or user-defined dictionary. Worry not; it's even smart enough to handle camel case!

#### <a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode" target="_blank">Prettier</a>

Although some might consider it a bit too opinionated, I admire the formatting provided by the Prettier extension--so much so that I let it perform its formatting on save! Never worry about curly brace spacing, omitting semicolons, double vs. single quotes, or countless other formatting options ever again. Heck, take it a step further and enforce the style guidelines project-wide with a config file and you're good to go.

#### <a href="https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare" target="_blank">Live Share (beta AF)</a>

I preface this suggestion with a warning: this feature is still _very_ much in beta. That said, Live Share is a promising extension for VSCode that lets you share your workspace with team members to collaborate on files or entire projects. Think Google Docs for your code.

#### <a href="https://marketplace.visualstudio.com/items?itemName=karigari.chat" target="_blank">Team Chat</a>

As a developer, I try to reduce the number of distractions I encounter throughout the workday so I can focus on the abstractions and logic flow for the application at hand. By hooking Slack directly into my IDE through Team Chat, I don't have to context switch as often by jumping back and forth between applications. While it might seem dangerous to keep something like Slack integration in your editor, I've found the experience to be enjoyable and not too distracting.

#### <a href="https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer" target="_blank">Bracket Pair Colorizer</a>

Although I stick with a fairly monochromatic theme, I occasionally switch this extension on to double-check my bracket alignment. It's helpful when I'm working with array methods, nested objects, or some complicated logic that I can't quickly settle any open/close problems with.

#### <a href="https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens" target="_blank">Version Lens</a>

The final extension worth highlighting is Version Lens, which allows you to examine your `package.json` file and examine the versions of your project's third-party dependencies. This helps to quickly identify libraries that can be upgraded or modified.

_Note: You don't have to go to the web to download extensions. If you'd prefer, navigate to (Code->Preferences->Extensions) or type (command+shift+x) on a Mac to open the extensions sidebar within the editor._

### Section Two: Snippets

Another helpful feature of VSCode is the concept of snippets, or templates of reusable code segments that remove the redundancy from common tasks.

When starting a project with a library, the first task I usually perform before writing code is making sure I have the library's snippet extension installed in my editor. Here are a few common ones:

- <a href="https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets" target="_blank">React</a>
- <a href="https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets" target="_blank">Vue</a>
- <a href="https://marketplace.visualstudio.com/items?itemName=bierner.lit-html" target="_blank">lit-html</a>
- <a href="https://marketplace.visualstudio.com/items?itemName=amandeepmittal.expressjs" target="_blank">Express</a>

Snippets are more than just assistors for templating; they can be used to template out an entire html page (<strong>html:5</strong>) or build out conditionals and code blocks for you as well (<strong>if</strong>).

What's even better, writing your own is as easy as creating your own snippet file named by language (javascript.json) or inserting them directly into the editor preferences (Code->Preferences->User Snippets).

Rather than providing you with copy/pasted bullet points for how to achieve this, Here's the <a href="https://code.visualstudio.com/docs/editor/userdefinedsnippets" target="_blank">thorough documentation page</a> provided by VSCode on how to write your own. Once you start writing your own, you'll never stop 🧟.

### Section Three: Terminal Hacks

This section is the most recent set of enhancements I've discovered, but they're by far my favorite on this list. Aside from advocating that you keep your terminal workflow within the confines of your workspace, here are three tips to enhance the terminal experience:

#### Named Terminal Windows

For one of my projects, I typically keep three terminal windows open: one for the API server, one for the app server, and one left open for running tests and navigating git branches. Besides staying consistent with which terminal runs what, I've gotten into the habit of naming the windows from within the editor.

To accomplish this, open the command palette (command+shift+p on a Mac) and type in `Terminal: Rename`. This will name the currently active tab whatever you input. Pretty cool trick!

#### Quick Create

A short-but-sweet tip that relates to the previous one: if you want to quickly open a new tab window from an existing one, simply hit (control+shift+~) on your keyboard.

#### Keyboard Shortcut for Switching Tabs

If you get tired of switching between the tabs from the dropdown at the top-right corner of the terminal window, you can always define a keyboard shortcut that implements the desired functionality!

This can be accomplished by going to Code->Preferences->Keyboard Shortcuts (command+k, command+s on a Mac) and clicking the curly braces in the top-right corner of the editor. This will open up the _keybindings.json_ file. Here's my configuration for switching between tabs:

_keybindings.json_:

```json
[
  { "key": "ctrl+shift+x", "command": "workbench.action.terminal.focusNext" },
  {
    "key": "ctrl+shift+z",
    "command": "workbench.action.terminal.focusPrevious"
  }
]
```

As you can see, I've made it so navigating back and forth between tabs is as easy as (control+shift+z) and (control+shift+x), respectively.

### Section Four: TypeScript Support

One unexpected benefit I've discovered within VSCode is how easy it makes learning and exploring TypeScript. From enhanced IntelliSense and object introspection to better import organization and code navigation, the IDE makes using the JavaScript superset a divine experience. What's more, there are additional tweaks you can make to feel truly enlightened.

The first suggestion I'd offer is downloading the <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin" target="_blank">TSLint extension</a>. This helps identify issues much faster and will allow you to fix problems in real-time as opposed to batching when compiling manually.

Then, if you're working primarily with _.ts_ files and miss the days of auto-compiling and "watch" support, you're in luck: there's a command to auto-compile your files on save!

In order to get auto-compile to work, first make sure you have a _ts.config.json_ file in your project root. You can create one easily by installing the _tsc_ package globally and then running `tsc --init` in the command line.

_Note: it goes without saying that you'll need the TypeScript package installed globally as well. `npm install -g typescript`, if needed._

Next, type (command+shift+b) on a Mac (or control+shift+b on a Windows platform) and type `tsc: watch - tsconfig.json`. After this step, your project will compile TypeScript files on every save.

Pair this with a watch command from your favorite development server (I dig _nodemon_) and you're good to go.

### Section Five: Testing Assistance

No development experience would be complete without a solid testing workflow. Whether it be unit testing or full-on end-to-end checks, there are a few extensions and features that'll supplement the IDE to help you catch bugs faster.

#### Jest Integration

Although I've used <a href="https://github.com/avajs/ava" target="_blank">AVA</a> on the last few projects, Jest has caught my eye recently with its robust community advocation and extensive tooling. One of the coolest integrartions I've found is the <a href="https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest" target="_blank">Jest extension</a>. Among its many benefits, per their GitHub page:

- Automatically starts Jest when it's installed and you're in the project root
- Shows test results inline
- Syntax highlighting in snapshot files
- One button update for failed snapshots

There's even a configuration for displaying code coverage within your project. In short, the extension gives you a trove of information about your project with little effort on your part.

There are extensions that offer similar functionality if you don't use Jest, namely the <a href="https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer" target="_blank">Test Explorer UI</a> extension.

#### Debugging

As for troubleshooting problems, VSCode also has debug tools baked right into the application. If you're running a Node-based project, it'll work right out of the box. If you're developing client-side, you'll need to install _one more_ extension: the <a href="https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome" target="_blank">Debugger for Chrome</a>.

For more info on debugging with VScode, the team has published a <a href="https://code.visualstudio.com/docs/editor/debugging" target="_blank">helpful article</a>.

### Bonus: Theme Suggestion

Since I love to hear what other developers choose for a theme, here's mine: <a href="https://marketplace.visualstudio.com/items?itemName=be5invis.theme-verdandi" target="_blank">_Verdandi Alter_</a>.

While the monochromatic color scheme might seem jarring to some, I appreciate the subtlety it commands with different font treatment to distinguish keywords, strings, and other areas of the code.

One more optional preference; I keep my sidebar on the right-hand side so it doesn't move the code in my open file when expanding/collapsing it.

### Conclusion

Hopefully you found _something_ within this list that you can use to enhance your development experience.

Keep in mind that much of what I mentioned today was about JavaScript productivity assistors. If you have suggestions for other languages, feel free to let me know on Twitter, or start your own blog and share the knowledge!

As always, thanks for reading.
