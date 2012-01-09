TWSS
====

This is a node.js module that classifies if a sentence can be replied with "that's what she said".

Installation
-----

    npm install twss


Usage
-----

    var twss = require('twss');
    
    twss.is("Nice weather we're having today") // > false
    twss.is("Can you make it harder?")         // > true
    twss.is("You're not going fast enough!")   // > true

Parameters
-----

You change algorithm from the default [naive bayes classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) (_nbc_) to a [k-nearest neighbor](http://en.wikipedia.org/wiki/K-nearest_neighbor_algorithm) algorithm (_knn_).

    twss.algo = 'nbc';
    twss.algo = 'knn';

If you want more obscure jokes to be accepted, you can set the "probability the sentence can be replied with twss" threshold. Be aware that a too low threshold may result in a lot of false-positives, and a too high threshold may result in a lot of false-negatives.

    twss.threshold = 0.5;
    twss.is("You're hardly my first.") // false

        twss.threshold = 0.3;
    twss.is("You're hardly my first.") // true