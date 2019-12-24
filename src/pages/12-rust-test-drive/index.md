---
title: 'Automating Workflows: a Dead Simple Experiment with Rust'
date: '2019-10-28'
---

# Background

- reducing toil and Google SRE pitch, why I wanted to automate the boilerplate away while also learning Rust.

Seemed like a good use case for the task. Figured after building I'd know:

- working with different data types 
- handling IO operations
- writing to a file
- designing project structure through a few different modules (io handler, template builder, main program)
- writing tests
- wiring it to the cli

# Why Rust - brief blurb

Talk about reasons why I learned
- coworkers cited as an example for a better language to write in that JS
- related, the polls showing it as the most developer happiness
- also kinda related; discuss safety and efficiency, how it interests you since deal with high-traffic workloads and would like to introduce at work in some way 
- web assembly

Before we get started: Yes, I know this could be a two-line bash script. (I know this because I wrote one to get that number.) Still, I'd rather learn Rust 😏🦀, so stick around for the joy of exploration.

Alright, let's dive in.

# Scaffolding the Project

If you haven't already done so, install the rust compiler and package manager by following the instructions in the Rustlang documentation. <TODO link>

The project consist of only a few modules. Here's the tree structure for the repo: 

```
.
├── Cargo.lock
├── Cargo.toml
├── README.md
└── src
    ├── main.rs
    ├── reader.rs
    └── template.rs
```

Most of these files were generated from the `cargo new <project>` command. Give it a shot on your local machine to see an example scaffolded project for yourself.

Let's take a look at `main.rs` for a general overview of the program's workflow.

_main.rs_:

```rust
mod reader;
mod template;

fn main() {
    let template_info = reader::handle_input();
    template::generate(&template_info);
}
```

First, we bring two modules into scope: reader and template. We'll dig into those files in a moment.

For now, it's worth mentioning that our main function (the entrance into our application) contains only two lines of code. First, we store the result of a `handle_input` function from the reader module in a template (judging from the variable name). Next, we generate a template, passing the template info to the necessary builder. So far so predictable, if you ask me. 

Let's drill in from the top, starting with the reader module.

_reader.rs_:

```rust
use std::io;

pub fn handle_input() -> Vec<String> {
  // Here I should make a check for cli args and return them if they're present
  let article_name = String::from(get_file_name());
  let article_title = String::from(get_article_title());
  let mut res = confirm(&article_name, &article_title);

  res.pop();
  while res != "y" {
    return handle_input();
  }
  vec![article_name, article_title]
}

fn get_file_name() -> String {
  println!("\nName of file: ");

  format_name(read_input(), true)
}

fn get_article_title() -> String {
  println!("\nName of the blog title: ");

  format_name(read_input(), false)
}

fn confirm(article_name: &str, article_title: &str) -> String {
  println!("\nArticle Name You Typed: {}", article_name);
  println!("\nArticle Title You Typed: {}", article_title);
  println!("\nConfirm: y/N:  ");

  read_input()
}

fn read_input() -> String {
  let mut response = String::new();

  io::stdin()
    .read_line(&mut response)
    .expect("Failed to read line");

  response
}

// Research if there's a better pattern in Rust other than manually passing flag.
// - no function overloading
// - no default parameters
fn format_name(mut name: String, strip: bool) -> String {
  name.pop();
  if strip {
    name = name.replace(" ", "-");
  }
  name
}

// Write the test for checking input first
// Also look how to test/mock fake cli args with rust (?)
#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn format_name_works() {
    assert_eq!("war", format_name(String::from("ward"), false));
    assert_eq!(
      "this-should-have-no-spaces",
      format_name(String::from("this should have no spaces\n"), true)
    );
    assert_eq!(
      "this should have spaces",
      format_name(String::from("this should have spaces\n"), false)
    )
  }
}
```

Considerably more going on in this module 😰. Fear not, brave rustaceans: all can be explained.

# I/O, string handling, promises 

# Writing Files, more promises 

# Writing Tests, Promises/Types 

# Final Step: Creating a CLI Command

_Note: the following section assumes you're running on a Mac. TODO write the instructions for Windows maybe_

Finally, we're going to write a bash script and drop it in the proper path to make it executable.

Start by `cd`ing into the `/usr/local/bin` directory and creating a file. Name it something intuitive like `create-blog-page` (with no extension, as it'll eventually be the command you run).

The file contents should look like this:

_/usr/local/bin/create-blog-page:_

```
#!/bin/bash
cd ~/<path-to-rust-project>
cargo run
```

When you're finished, give the file the proper permissions to execute: `chmod 755 create-blog-page`

If everything's properly hooked up, you should be able to run the command and see the program kick off!

<TODO screenshot of terminal running rust command>

# What Lies Ahead

Look out for an article on merging Rust work with Web Assembly to deliver something fun over the web. Until then, here are a few resources I found helpful throughout my spike:

- official rust docs. talk about being one of the advantages of the language 