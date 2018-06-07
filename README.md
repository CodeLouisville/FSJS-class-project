# FSJS Week 4 - The Full Stackey

**Outline**

* Set up the project
* Organize our project javascript
* Render data from the server on our page
* Add POST and PUT endpoints


## Set up the project
```
git stash
git checkout -f week4
npm install
```

## Organize our project javascript
Putting all our javascript in `<script>` tags may be convenient, but it will soon get unwieldy.  Let's put our javascript in a separate `.js` file and pull that in to our HTML.

### 1. Create a new file in a new directory: `public\js\app.js`.
(We could continue to put all our javascript in `script` tags in `index.html`, but placing this code in a separate file will help keep things neat and organized)

### 2. Load this in to our `index.html`.  At the bottom of the file, just below the `script` tag that loads the handlebars library, add:
```html
<script src="/js/app.js"></script>
```

### 3. Take this opportunity to think about the project goals and stub out a few functions which we will use (or refactor) to accomplish those goals

We know we need to fetch data from the server...
```javascript
/**
 * Fetches data from the api
 */
function getFiles() {

}
```

And we know that we need to render a list of files on the page...
```javascript
/**
 * Render a list of files
 */
function renderFiles(files) {

}
```

aaaaand we should probably have some function that ties those two operations together...
```javascript
/**
 * Fetch files from the API and render to the page
 */
function refreshFileList() {

}
```

...ok we can stop there. That's the basics.  We will definitely add more functions as needed. For now, let's fill in some of the details.

## Render data from the server
We have a nice API endpoint to spit out data (albeit static data from an array).  Let's use that in our front-end.  

### Consuming our API
First, let's see if we can pull data from our API. Last week, we used Postman to test our enpoint. Now we want to use javascript to do something similar.  We'll use the browser's built-in AJAX library, [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).  Of course, you could use another AJAX library like [Axios](https://github.com/axios/axios), [jQuery](http://api.jquery.com/jquery.ajax/), [Superagent](https://visionmedia.github.io/superagent/), or [Request](https://github.com/request/request).

(the `fetch` api uses Promises, so it is important to understand how they work.  Read up on some [Promises Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))
```javascript
/**
 * Fetches data from the api
 */
function getFiles() {
  return fetch('/api/file')
    .then(response => response.json())
    .then(files => {
      console.log("Files, I got them:", files);
      return files;
    })
    .catch(error => console.error("GETFILES:", error));
}
```
Head over to your browser console and try this out. `getFiles` is on the `window` object, so we should be able to simply type `getFiles()` and see the results.

What about that render function?  We'll have a function that takes an array of files as an argument and then uses template literals to generate html
```javascript
/**
 * Render a list of files
 */
function renderFiles(files) {
  const listItems = files.map(file => `
    <li class="list-group-item">
      <strong>${file.title}</strong> - ${file.description}
    </li>`);
  const html = `<ul class="list-group">${listItems.join('')}</ul>`;

  return html;
}
```

And now! We combine the two.
```javascript
/**
 * Fetch files from the API and render to the page
 */
function refreshFileList() {
  getFiles()
    .then(files => {
      const html = renderFiles(files);
      $('#list-container').html(html);
    });
}
```
Test it out by refreshing the page, opening a debugging console, and typing `refreshFileList()`;

### Integrate this in to our page

So to make this the default behavior of the page, we need to do two things:

1. Get rid of our previous demo code in `index.html`. 
2. Call `refreshFileList()` once the page has loaded.

Your html should look like this
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Our Glorious Node Project</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
  </head>
  <body>
    <div class="container">
      <h1>A wild webpage appears...</h1>
  
      <div id="list-container"></div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="/js/app.js"></script>
    <script>
      $(document).ready(function() {
        refreshFileList();
      });
    </script>

  </body>
</html>
```

## Pushing data back up to the server

Thus far, data flow has been one-way.  The client requests data, the server delivers.  HOWEVER, when we create, update and delete records in/from our application, we will need to send some data up to the server from the client.  Let's work on that.

First thing to understand is that when an http request is made, it is broken in to small chunks and sent out in to the universe via the TCP protocol.  That means that Node has to put those pieces back together, in order.

This also means that whatever nice, coherent message you lovingly placed inthe body of your POST or PUT message is now just a series of ones and zeros in memory and you have to tell Node what they mean before you can use them.

_**Body-Parser to the rescue!!!**_

```
npm install body-parser --save
```
[[Documentation for body-parser](https://github.com/expressjs/body-parser)]

`body-parser` will look at the body of a request and, if the `Content-Type` is `application/json`, will parse the body using `JSON.parse()`.  The results of that (if successful) will be put in `req.body` for use by any middleware.

2. At the top of `server.js`, require the body-parser module:
```javascript
const bodyParser = require('body-parser');
```

3. Tell our server to use it.  In `server.js`, right AFTER we set up static files serving, add the following:
```javascript
app.use(function(req, res, next) {
  console.log("req.body BEFORE parsing", req.body);
  next();
})

app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log("req.body AFTER parsing", req.body);
  next();
})
```
Head over to postman. Create a POST request to ANY endpoint.  Tell postman that the content is JSON (use the dropdown).  Type in any valid JSON-formatted string and hit send.  You'll see the contents outputted by the two middleware we added before and after the bodyParser middleware.

4. Delete the logging middleware

5. Go back to our routes and edit our POST and PUT handlers make changes to our fake DB:
```javascript
router.post('/file', function(req, res, next) {
  const data = req.body;
  console.log("POST DATA", data);

  res.end('Create a new file');
});
```
and
```javascript
router.put('/file/:fileId', function(req, res, next) {
  const data = req.body;
  console.log("PUT DATA", data);

  res.end(`Updating file '${req.params.fileId}'`);
});
```
