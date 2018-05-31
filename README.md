# FSJS Week 3 - A Wild Router Appears

**Outline**

* Set up the project
* Grab some DevTools
* The 5 operation of CRUD (list, detail, create, update, delete)
* Send mock, static data as response


## Set up the project
```
git stash
git checkout -f week3
npm install
```

## Hooray! New DevTools!

### Postman

Postman allows you to send HTTP requests to your API.  You can tailor the url, method, payload, querystring, and headers.  This is a very powerful API testing tool which will make our development easier.

[[Download here](https://www.getpostman.com/docs/postman/launching_postman/installation_and_updates)]

### Nodemon

Tired of restarting your Node server every time you change a file? Hand getting a cramp from hitting `ctrl-c` after every typo fix? **You're in luck**

Enter: Nodemon - Monitor for any changes in your node.js application and automatically restart the server - perfect for development.

```
npm install nodemon -g
```

Here, we're NOT using the `--save` switch, but we are using the mysterious `-g`.  `-g` tells npm to install Nodemon globally (so it will be available for all your projects).  Therefore, we don't need to save it to our `package.json` file.

Next, add a script to `package.json`.  Find the `scripts` section and replace it with the following:
```javascript
"scripts": {
  "start": "nodemon src/server.js"
},
```
[[Documentation on NPM scripts](https://docs.npmjs.com/misc/scripts)]

To start our server, type:
```
npm start
```

Now, when we make changes to files, the server restarts automatically.  Try it out!

## The 5 Operations of CRUD

| Operation | Suggested HTTP | Data |
| --- | --- | --- |
| Create | POST | Create a new element |
| Read   | GET  | Get a single element |
| Update | PUT  | Replace an element with new data |
| Delete | DELETE | Delete a single element |
| List | GET  | Get an array of elements |

### 1. Do a little clean-up.

Move our endpoints to a separate file. This will help keep the overall application organized.  Add the following to `routes/index.js`
```javascript
// src/routes/index.js
const router = require('express').Router();
```
[[ExpressJS Router documentation](https://expressjs.com/en/4x/api.html#router)]

A router object allows us to create an isolated bundle of endpoints and middleware.  This is not new functionality, just a convenient way to package code in to separate, easy-to-read and easy-to-maintain files.

Now, move our existing routes over from `server.js`:
```javascript
router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

module.exports = router;
```
(Note that our "Hello world" route is unnecessary since we are serving a static index.html)

### 2. Tell express to use our new router

Now, head back to `server.js` and make sure our app knows how to use the router.  Create a variable for our router at the top of the file:
```javascript
const router = require('./routes');
```
And then direct our app to use the router AFTER the line where we handle static files:
```javascript
app.use(express.static(publicPath));
app.use('/api', router);
```

What does the `'/api'` part do? [`app.use()` Documentation here](https://expressjs.com/en/4x/api.html#app.use).  Basically, this prepends `/api` to all the paths defined in `router` (currently, we only have `/doc`). So, instead of making a GET request to `/doc`, we will now make a request to `/api/doc`.

### 3. Fire up postman and try it

...go ahead...we'll wait.

### 4. Create stubs for our operations

Stubs are placeholders.  You write them so that you remember to come back and fill them in with real logic later.
In `routes\index.js`, add:

```javascript
/**
 * C - reate
 */
router.post('/file', function(req, res, next) {
  res.end('Create a new file');
});
/**
 * R - ead
 */
router.get('/file/:fileId', function(req, res, next) {
  res.end(`Reading file '${req.params.fileId}'`);
});
/**
 * U - pdate
 */
router.put('/file/:fileId', function(req, res, next) {
  res.end(`Updating file '${req.params.fileId}'`);
});
/**
 * D - elete
 */
router.delete('/file/:fileId', function(req, res, next) {
  res.end(`Deleting file '${req.params.fileId}'`);
});
/**
 * ¯\_(ツ)_/¯ - list
 */
router.get('/file', function(req, res, next) {
  res.end('List all files');
});
```
[[Documentation for router.get() and router.post()](https://expressjs.com/en/4x/api.html#router.METHOD)]
[[Documentation for Route Parameters](https://expressjs.com/en/guide/routing.html#route-parameters)]

Route parameters allow you to pass information to the router via the url itself.  When express finds a route parameter (indicated by `:<parameter name>`), it creates a property on `req.params` with the same name.

### 5. Return some (faked) data

We're not ready for a database yet, but we can add a fake "database" so that we can start testing our front-end.
Let's add a static array of "file" object for testing purposes.  Near the top of the `routes/index.js` file, add the following:
```javascript
const FILES = [
  {id: 'a', title: 'cutecat1.jpg', description: 'A cute cat'},
  {id: 'b', title: 'uglycat1.jpg', description: 'Just kidding, all cats are cute'},
  {id: 'c', title: 'plaintext_passwords.txt', description: '12345 - like my luggage'},
  {id: 'd', title: 'got_S08E01.mp4', description: 'home video of...a cat'},
];
```

**NOW** Return the entire list as JSON.  Replace the handler for `GET /file`, with:
```javascript
router.get('/file', function(req, res, next) {
  res.json(FILES);
});
```
[[Documentation for res.json()](https://expressjs.com/en/4x/api.html#res.json)]

`res.json()` accepts any type of data, stringifies with `JSON.stringify()` and sends the response with the header `Content-Type: application/json`.

### 6. Keep going with the CRUD operations

Return a single element by replacing the handler for `GET /file/:fileId` with:
```javascript
router.get('/file/:fileId', function(req, res, next) {
  const { fileId } = req.params;
  // same as 'const fileId = req.params.fileId'

  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});
```
[[Documentation for object destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring)]
[[Documentation for Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?v=example)]
[[Documentation for res.status()](https://expressjs.com/en/4x/api.html#res.status)]