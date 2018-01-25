# FSJS Week 2 - Our Superlative Web Page

**Outline**

* Set up the project for the front end
* Serve a static page
* Add a template engine

## Set up the project
```
git checkout week2
npm install
```
_This should be similar to how we left it from [week 1](/CodeLouisville/FSJS-class-project/tree/week1)_


## Serve a static page
1. Create a "public" directory inside the root directory
```
mkdir public
```

2. Set up our express application to serve static files.
Add a reference to Node's `path` module to the top of the page in the `server.js`
```javascript
const path = require('path');
```
[[Documentation for path](https://nodejs.org/api/path.html)]

Then add the following line to `server.js` BEFORE any routes
```javascript
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
```
[[Documentation for Node Modules (dirname)](https://nodejs.org/api/modules.html)]
[[Guide for ExpresJS static](https://expressjs.com/en/starter/static-files.html)]

`express.static()` will search the `public` directory for a file that matches the requested path. For example: `index.html`, `img/puppy.jpg`, etc.  If there is a match, that file is streamed back to the requester, otherwise, express moves on to the next route.

3. Add an `index.html` to the public folder.
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Our Glorious Node Project</title>
  </head>
  <body>
    <div class="container">
      <h1>A wild webpage appears...</h1>
    </div>

  </body>
</html>
```

4. Start the server and check that you can access a static `html` page

Note: We previously had a "Hello World" endpoint that was served when user's requested the path `/`.  That path is now unreachable, because all requests for `/` will receive `index.html`.

`/doc` still works, though.


## Add a template engine
1. We'll be using jQuery and Handlebars, so let's add them to our `index.html` at the end of the `<body>` tag
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.8/handlebars.min.js"></script>
```
[[Documentation for jQuery](https://api.jquery.com/)]
[[Documentation for Handlebars](http://handlebarsjs.com/reference.html)]

2. Drop a quick template in `index.html` to see how handlebars renders content:
```html
<script>
  $(document).ready(function() {
    const data = { name: "Code Louisvillains" }
    const greetingTemplate = 'Hello {{name}}! I am a template!';
    const greetingCompiled = Handlebars.compile(greetingTemplate);
    const greetingRendered = greetingCompiled(data);

    $('body h1').first().after(greetingRendered);
  });
</script>
```

3. Render a list of fake data.  Start by adding a place in the html to render the list after the `<h1>`:
```html
<div id="list-container"></div>
```

4. Create some fake data in another script tag
```html
<script>
  $(document).ready(function() {
    const data = {
      list: [
        {name: 'Buffy', value: 'Slayer, guidance counselor'},
        {name: 'Willow', value: 'Witch'},
        {name: 'Xander', value: 'Dude, construction worker'},
        {name: 'Giles', value: 'Watcher, Librarian'},
      ],
    };
  });
</script>
```

5. Create a template for each list item.
```html
<script id="list-template" type="text/x-handlebars-template">
  {{#each list}}
  <div class="row">
    <div class="col-xs-6"><strong>{{name}}</strong></div>
    <div class="col-xs-6">{{value}}</div>
  </div>
  {{/each}}
</script>
```

6. Right below the `list` array, compile the template and render it into the container.
```javascript
const template = $('#list-template').html();
const compiled = Handlebars.compile(template);
$('#list-container').html(compiled(data));
```

7. Refresh the page

8. Add some style in the `<head>`
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
```