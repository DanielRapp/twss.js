TWSS
====

This is a node.js module that classifies if a sentence can be replied with "that's what she said".

Installation
-----

    npm install twss


Usage
-----

    var twss = require('twss');
    
    twss.is("Nice weather we're having today"); // false
    twss.is("Can you make it harder?");         // true
    twss.is("You're not going fast enough!");   // true

Settings
-----

######twss.algo
You change algorithm from the default [naive bayes classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) (_nbc_) to a [k-nearest neighbor](http://en.wikipedia.org/wiki/K-nearest_neighbor_algorithm) algorithm (_knn_).

    twss.algo = 'nbc';
    twss.algo = 'knn';

######twss.threshold
If you want more obscure jokes to be accepted, you can set the "probability the sentence can be replied with twss" threshold. Be aware that a too low threshold may result in a lot of false-positives, and a too high threshold may result in a lot of false-negatives.

    twss.threshold = 0.5;
    twss.is("You're hardly my first."); // false

    twss.threshold = 0.3;
    twss.is("You're hardly my first."); // true

Additional functions
-----

######twss.probability
If you'd just like the probability that a sentence can be replied with "That's what she said" you can use the `twss.probability` function.

    twss.probability("Behold, I come quickly."); // 0.956323045469951

Or just use the alias `twss.prob`

    twss.prob("The juice keeps coming out of the wrong hole!") // 0.9961630818418142