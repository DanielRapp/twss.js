TWSS.js is a node.js module that classifies if a sentence can be replied with "that's what she said".

Very much in the middle of development. But you may find the classifier and utils/document scripts useful.


Installation
----
Just clone the repo:

```
git clone git://github.com/DanielRapp/twss.js.git
```

Require the script:

```javascript
var classifier = require('./Twss.js/classifier/nbc');
```

And start classifying:

```javascript
var trainingData = {
  "pos": require("./Twss.js/data/Positive_Promts_TS").data,
  "neg": require('./Twss.js/data/Negavite_Promts_FML').data
};
console.log(classifier.isTwss({
  "promt":           "Can you make it harder?",
  "trainingData":    trainingData
}));
```

Cleaning up number of steps for a classification is definitely a priority on the todo list.


Dependecies
----
**You don't need to configure or install anything to use the classifers.**

For the bot to work you need a special version of [node-twitter](https://github.com/christopherwright/node-twitter) with ssl. Just clone the repo and  place it in the root of the module folder.

You also need the npm modules "cookies" and "oauth".

```
npm install cookies
```

```
npm install oauth
```