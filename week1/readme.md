# FSJS Project Week 1

## Install NodeJS

- [Windows (http://blog.teamtreehouse.com/install-node-js-npm-windows)](http://blog.teamtreehouse.com/install-node-js-npm-windows)
- [Mac (http://blog.teamtreehouse.com/install-node-js-npm-mac)](http://blog.teamtreehouse.com/install-node-js-npm-mac)
- [Linux (http://blog.teamtreehouse.com/install-node-js-npm-linux)](http://blog.teamtreehouse.com/install-node-js-npm-linux)

## Start a project
Starting a project in node is simple:
```
mkdir my_awesome_project
cd my_awesome_project
npm init
```

`npm init` simply creates a `package.json` file a populates it with the answers to some questions.  You can edit it in a text editor.

## Sample project organization
When starting a project, a good practice is to lay out your directory structure and create some empty, basic files:
.
├── index.js          // Entry point
├── package.json
└── src
    ├── config        // application configuration
    │   └── index.js
    ├── models        // Database models
    │   └── index.js
    ├── routes        // HTTP(S) routing/controllers
    │   └── index.js
    └── server.js     // Set up server and listen on port

## Add a library
Perhaps the primary use of `npm` is to add packages to your project.  We're going to add the 'E' of 'MEAN' to our project right now:

```
npm install express --save
```

This tells `npm` to download the 'express' package, save it in a newly created `node_modules` directory, and then add a line in `package.json` to make note of the fact that we need 'express' for this project (that's what the `--save` part does).

## require() is a big deal
Yes it is.  The full documentation for require() (really, for Node modules in general) can be found [here (https://nodejs.org/api/modules.html)](https://nodejs.org/api/modules.html).

`require()` is what allows you to organize your code in to easy-to-understand (hopefully) directories and files, but join them all together in to a single application.

For comparison: in a browser environment, if you want to make content from multiple file available to the larger application you can 1) concatenate them all in to one file or 2) load them individually via a `<script>` tag.  Then, the objects or functions in the file need to be made available by putting them in the global scope (which is `window` in a browser) or be added to some global object (like, say, `jQuery` via a plugin);

`require()` serves that purpose on the server side by reading the contents of the file you specify, executing it, and making whatever you export available.
```javascript
// index.js
var myRandomObject = require('./myFile');

// myFile.js
exports = {some: {random: ['object']}};
```

### What's with all these index.js files
You will see (and create) a lot of `index.js` files in your Node lifetime.  The reason for this has to do with how `require()` behaves.

When you pass the name of a directory to `require()`, it will specifically seek out a file in that directory named `index.js` (if it doesn't find one, it looks for index.node, but that's a story for another time)


### So this can be confusing.
Your text editor may have half a dozen open tabs - all with the name `index.js`. That's annoying, but the `index.js` naming convention is there for good reason and it is an important aspect of nodejs development.

Remember, you don't HAVE to have an `index.js` file in a directory, but you should know how Node treats that file if you do.

A couple of suggestions:
- Learn to pay attention to the names of directories as much as you pay attention to the names of files
- Add a comment at the top of the file that tells you where you are.  For example:
```javascript
// some/directory/index.js
```
or
```javascript
// yet/another/directory/index.js
```
