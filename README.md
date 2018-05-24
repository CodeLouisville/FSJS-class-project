# FSJS Week 2 - Our Superlative Web Page

**Outline**

* Set up the project for the front end
* Serve a static page
* Add a template engine

## Set up the project
```
git checkout -f week2
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
1. We'll be using jQuery and template literals to make live changes to the DOM, so let's add jQuery to our `index.html` at the end of the `<body>` tag
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```
[[Documentation for jQuery](https://api.jquery.com/)]
[[Documentation for Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)]

2. Let's explore template literals a bit.  Open the console in your browser:
```javascript
let string1 = `template literals
can
be multiline`

let name = "Bob";
let string2 = `Hello ${name}!!!`;

let data = {name: 'Bob'};
let string3 = `Hello ${data.name}!!!`;

let collection = [
  {_id: 1, name: 'Bob'},
  {_id: 2, name: 'Bobbers'},
  {_id: 3, name: 'Bobberino'},
];
let string3 '';
for (let item of collection) {
  string3 += `Hello ${item.name}!!!\n`;
}
// Or better yet
let string4 = collection.map(item => `Hello ${item.name}!!!`).join('\n');

// Let's make some cool HTML
let string5 = `<ul>
  ${collection.map(item => `<li>Hello ${item.name}!!!</li>`).join('\n')}
</ul>`;
```

2. Drop a quick template in `index.html` to see how handlebars renders content:
```html
<script>
  $(document).ready(function() {
    const data = { name: "Code Louisvillains" }
    const html = `Hello ${data.name}! I am a template!`;

    $('body h1').first().after(html);
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
    const data = [
      {name: 'Buffy', value: 'Slayer, guidance counselor'},
      {name: 'Willow', value: 'Witch'},
      {name: 'Xander', value: 'Dude, construction worker'},
      {name: 'Giles', value: 'Watcher, Librarian'},
    ];

    const listHtml = data.map(line => `
      <div class="row">
        <div class="col-xs-6"><strong>{{name}}</strong></div>
        <div class="col-xs-6">{{value}}</div>
      </div>`).join('\n');

    $('#list-container').html(listHtml);
  });

</script>
```

5. Refresh the page

6. Add some style in the `<head>`
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
```