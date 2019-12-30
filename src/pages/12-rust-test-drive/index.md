---
title: 'Automating Workflows: a Dead Simple Exploration of Rust'
date: '2019-10-28'
---

# Background

It's been said that learning a new language each year helps engineers stay on their feet.

I don't formally prescribe to this mode of thinking, but I _do_ experiment with new libraries, languages, and tooling every so often in order to glean new practices and ideas. 

One topic that's interested me during the last few years is web assembly. I'm intrigued specifically by its use cases, performance benefits, and influence over the future of the web. 

# Why Rust?

For the unfamiliar, Rust is a statically typed systems programming language that emphasizes speed and security. It's been repeatedly touted as the most enjoyable language to write, and it's being adopted by companies like XXX and XXX. 

Microsoft has even spent months experimenting with core system rewrites with the language, which they've deemed to be going "mostly positive". 

Finally, it's being used to optimize the delivery of robust experiences over the web through its use in web assembly. 

Alright, enough pitching. Since I decided to write some Rust, my next order of business was determining a use case for writing a new app.

After mulling my personal backlog for a day, I decided that a simple blog page scaffolding script would suffice. After all, it seems like a good excuse to learn a language. Building a program that generates files has to do many things, including: 

- work with different data types 
- handle IO operations
- write to a file
- have a project structure with +1 module
- write tests
- wire it to the cli

Before we get started: Yes, I know this could be a two-line bash script. (I know this because I wrote one to get that number.) Still, I'd rather learn Rust 😏🦀, so stick around for the joy of exploration.

On the subject of exploration: if you prefer the path of self discovery, here's a <a href="https://github.com/alephnode/rust-sandbox/tree/master/generate_blog_template" target="_blank">link to the GitHub repo</a> for this project.

Also, if you haven't already done so, install the Rust compiler and package manager by following the instructions in the <a href="https://doc.rust-lang.org/book/title-page.html" target="_blank">Rustlang documentation.</a>

Alright, let's dive in.

# Scaffolding the Project

The final tree structure for the project looks like this:

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

Most of these files were generated from the `cargo new <project>` command (recall that Cargo is the package manager for Rust). If you want, give it a shot on your local machine to explore the project it creates.

The `cargo.lock` file helps Cargo manage dependencies and versions. The `cargo.toml` file is where packages used and other instructions for Cargo are defined, as well as metadata about the project.

Next, let's take a look at `main.rs`. This is the file that Cargo assumes is the entry point for our Rust application. Examining this file often provides a general overview of a program's workflow.

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

In our `main` function, we store the result of a `handle_input` function from the reader module in a template (judging from the variable name). Next, we generate a template, passing the template info to the necessary builder. Looks easy enough.

For better context, let's step into some of the functions called.

# Reading User Input: Module One

_reader.rs_:

```rust
use std::io;

pub fn handle_input() -> Vec<String> {
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

fn format_name(mut name: String, strip: bool) -> String {
  name.pop();
  if strip {
    name = name.replace(" ", "-");
  }
  name
}

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

There's considerably more going on in this file 😰. Fear not, brave rustaceans: all can be explained.

In short, this file is implementing the functionality for reading user input. 

At the top of the file we bring all libraries used into scope. In this case, I'm leaning on the standard library's IO interface. 

Next we find the only public function in this module: `handle_input`, which was referenced in the `main.rs` file earlier. 

Because Rust is a statically typed language, the intention and flow of functions are often expressed in their signatures. `handle_input`'s looks like this:

```rust
pub fn handle_input() -> Vec<String>
```

We can see the function takes no input and returns an array containing the two values back to the caller. 

As for the body, we see it calls some internal functions and stores their result in variables named after the info collected. It also does this recursively until we receive confirmation from the user that the input is desired.

If you step further into the file, you'll see the actual IO handling implementation:

```rust
  io::stdin()
    .read_line(&mut response)
    .expect("Failed to read line");
```

One of the more impressive features I discovered with Rust was its Result type, which is returned from a function that suspects a recoverable error could happen. Such is the case in the example above with `read_line` from Rust's standard lib. In addition to calling the function to grab user input, I appended an exception handler (`except`) in case the operation failed.  

# Writing Tests

On the subject of safety, the austere, wise developer in you should be asking an important question by now: _where are the tests for these modules?_

Worry not, astute reader; this project is covered in them, they're just easy to miss.

You see, in something that has taken a bit of getting used to, unit tests are kept in the same file as the source code in Rust. I guess scrolling isn't considered a DX downside in systems programming :)

Joking aside, you can return to the previous `reader.rs` module above and see the tests defined in beneath the `#[cfg(test)]` macro:

_reader.rs_:

```rust
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

<explain tests format here>

To run the tests, simply bang this into the command line: 

```bash
cargo test
```

If you're working in VSCode, I noticed a sweet tooltip to run the tests from the file itself:

<screenshot of running tests inline>

Something I also do when writing Rust is occasionally verify my code's still compiling:

```bash
cargo check
```

OK, what should we tackle next? Because this was my first real foray into Rust territory, there are a few additional syntax-related points to call out:

- functions return implicitly when an expression ends without a semicolon
- something else
- rule of threes

Alright, on to the second half of this service: actually _creating_ the blog template!

# Creating the Blog Template: Module Two

# Final Step: Creating a CLI Command

_Note: the following section assumes you're running on a Mac.

Finally, let's write a bash script and drop it in the user directory so we can execute this program with a sweet alias like `create-blog-page <args>`

Start by navigating to your `/usr/local/bin` directory. Create a file, naming it what you'd like the command to be (so no file extension). An example would be `create-blog-page` like I did above.

The file contents should look like this:

_/usr/local/bin/create-blog-page:_

```
#!/bin/bash
cd ~/<path-to-rust-project>
cargo run
```

When you're finished, give the file the permissions necessary to run: `chmod 755 create-blog-page`

You should now be able to run the command and see the program kick off!

<TODO screenshot of terminal running rust command>

# What Lies Ahead

Look out for an article on merging Rust work with Web Assembly to deliver something fun over the web. Until then, here are a few resources I found helpful throughout my spike:

- official rust docs. talk about being one of the advantages of the language 
- web assembly docs 
- ffsend - firefox send client
- alacrity - terminal written in rust
- spotify terminal - coolest rust project ever