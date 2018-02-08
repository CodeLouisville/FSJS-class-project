# FSJS Week 4 - The Full Stackey

**Outline**

* Set up the project
* Render data from the server on our page
* Add POST and PUT endpoints


## Set up the project
```
git checkout -b week4 origin/week4
npm install
```

## Render data from the server
We have a nice API endpoint to spit out data (albeit static data from an array).  Let's use that in our front-end.  

1. Create a new file in a new directory: `public\js\app.js`.
(We could continue to put all our javascript in `script` tags in `index.html`, but placing this code in a separate file will help keep things neat and organized)

2. Load this in to our `index.html`.  At the bottom of the file, just below the `script` tag that loads the handlebars library, add:
```html
<script src="/js/app.js"></script>
```

3. Update our handlebars template to render a file and not a BTVS character list.  Replace the `#list-template` script in `index.html` with the following:
```html
<script id="list-template" type="text/x-handlebars-template">
  <ul class="list-group">
    {{#each files}}
    <li class="list-group-item">
      <strong>{{title}}</strong> - {{description}}
    </li>
    {{/each}}
  </ul>
</script>
```
While we're at it, we can let's delete the code that rendered our previous test data. (If you want to keep it around for reference, just comment it out.)

4. In `app.js`, create a function to get the file list:
```javascript
function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getFiles()", err);
      throw err;
    });
}
```

5. Create a function to refresh the list
```javascript
function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {
      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}
```
Test it out by refreshing the page, opening a debugging console, and typing `refreshFileList()`;

6. Refresh the list automatically when the page first loads by adding  `refreshFileList()` to the remaining `$().ready()` function in `index.html`

## Finish What we started
1. We are going to be sending data from the client back to the server.  To do that, we will convert a plain JS object to a JSON-formatted string (really, jQuery will do that for us).  We need to set up our express server to parse that JSON string and turn it back in to an object.

Fortunately, there a library for that:
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

5. Go back to our routes and add the POST and PUT endpoints. In `routes/index.js`, swap out the `router.put()` and `router.post()` callbacks (which were just placeholders) with the following:
```javascript
router.post('/file', function(req, res, next) {
  const newId = '' + FILES.length;
  const data = req.body;
  data.id = newId;

  FILES.push(data);
  res.status(201).json(data);
});
```
and
```javascript
router.put('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;
  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  file.title = req.body.title;
  file.description = req.body.description;
  res.json(file);
});
```
