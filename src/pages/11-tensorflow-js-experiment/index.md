---
title: 'Predicting XX Using TensorFlowJS'
date: '2019-07-30'
---

--- Find cool dataset, linear regression example

- best way to define a tensor: it's the representation of all the data we've compiled about the thing we want to predict. It's the weight, make, horsepower, price, and other factors that we use to predict mileage.

Fuck the wikipedia definition

As defined by Google in their workshop: The primary data structure in TensorFlow programs. Tensors are N-dimensional (where N could be very large) data structures, most commonly scalars, vectors, or matrices. The elements of a Tensor can hold integer, floating-point, or string values.

Dig deeper: we're so accustomed to basic correspondence with primitive values. Integer 3 relates to the count of a set of items. Array relates to a list of items in a collection. It's a useful abstraction to describe that.

But what about the more complex entities in life? Ah, objects.

I'm not here to imply that tensors are the natural evolution of data structures in programming languages. Rather, I'm saying that we need quantifiable approximations to find answers about these items.

- Pedro Domingo
- RB reference
- Andrew Ng's course, codecademy as well
- openAI example
- linear regression tuning visualization
- machine learning medium deep-dives
- MinutePhysics
- Describe limitations of JS port
- Explain what it _would_ be good at and implement
- Follow up with Python examples (?)
- Kaggle reference
- https://codelabs.developers.google.com/codelabs/tfjs-training-regression/ <-- google course on it!

Google best practice: shuffling/normalizing data
Also Google: batch sizes tend to be between 32-512

NEED TO DETERMINE SCOPE OF ARTICLE

- not everything I know about ML needs to be included
- intro to ML
- difference between linear and logistical regression, how example will be linnear
- explain difference between what's available in Python and what's good with the JS port
- introduce project specifics, explain dataset
- outline the basic pattern for machine learning
- carry out that pattern with the data example
- find some way to visualize or store result of project somewhere
- summary with numerous links for education, possibly plug additional examples in a series once I get more familiar with material

Better article first: normal forms, explained in XXX (gimicky but fuck it)

- possibly another article on clojurescript experimentation if its faster than wrapping this bigger project up
