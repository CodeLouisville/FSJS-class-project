# FSJS Week 6 - Something from Nothing

**Outline**

1. Set up for week6
2. Create a hidable form to add files
4. Client-side function to POST a new files
5. Server-side handler that creates file


## 1. Setup Project
1. Check out a clean week6 branch
```
git stash
git checkout -f week5
git pull
npm install
```

**Strategy:** 
* A User will visit the site and see a form for adding a file.  
* Our user will use that form to add a new File to the database.  
* The form has fields for `title` and `description` fields, a `Submit` and a `Cancel` button.  
* The `Submit` and `Cancel` buttons do exactly what you think they would do.  
* The `Submit` button will trigger a javascript function that grabs the data from the form and POSTs it to an API endpoint (we already have one...remember it?)
* After POSTing the data and receiving a response, the page will refresh the list of Files.
* The `Cancel` button will clear the form without POSTing the data

## 2. Create a form

1. Where we gonna put this form?  How about somewhere below the list
```html
<div id="form-container" class="panel">
  <form id="add-file-form">
    <legend>File</legend>
  </form>
</div>
```

2. That's cool, but maybe a little more....
```html
<div id="form-container" class="panel">
  <form id="add-file-form">
    <legend>File</legend>
    <div class="form-group">
      <label for="file-title">Title</label>
      <input type="text" class="form-control" id="file-title" placeholder="Title">
    </div>
    <div class="form-group">
      <label for="file-description">Description</label>
      <input type="text" class="form-control" id="file-description" placeholder="Description">
    </div>
    <button type="button" onclick="submitFileForm()" class="btn btn-success">Submit</button>
    <button type="button" onclick="cancelFileForm()" class="btn btn-link">cancel</button>
  </form>
</div>
```
Reload the browser and look at our beautiful form.  


3. What about those `onclick` functions?  We already know what 'cancel' should do (clear the form), but will figure out what `submit` does later.  In `app.js` add the following stubs:
```javascript
function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");
}

function cancelFileForm() {
  console.log("Someone should clear the form");
}
```
Test the buttons to make sure they work....

Great! They work, but they don't do much. Let's change that, one step at a time.

4. Add the following to our `submitFileForm` function after the `console.log` line:
  ```javascript
 function submitFileForm() {
   console.log("You clicked 'submit'. Congratulations.");

   const fileData = {
     title: $('#file-title').val(),
     description: $('#file-description').val(),
   };

   console.log("Your file data", fileData);
 }
 ```

## Fetch, our POSTing hero

We're going to POST json-formatted data to an endpoint on our server which will do all the hard work.  We already have a `POST /api/file` route, but currently it appends the file data to a static array (remember?  We never changed that).

First, we'll use fetch to POST the data, then we'll fix our POST route.

1. Add the following to our `submitFileForm` function AFTER we create the fileData object.
  ```javascript
  fetch('/api/file', {
    method: 'post',
    body: JSON.stringify(fileData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(file => {
      console.log("we have posted the data", file);
      refreshFileList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
  ```
  If we refresh the page and test this, it will NOT work. Why?


## Now, fix the POST route handler

1. Open the file `src/routes/index.js` and delete everything in our `POST /file` handler.  It should look like this when we're done:
  ```javascript
  router.post('/file', function(req, res, next) {

  });
  ```

2. Instead of appending to an array, we will use our mongoose model to insert a new "File" in to the database.  Change the `POST /file` handler to the following:
  ```javascript
  router.post('/file', function(req, res, next) {
    const File = mongoose.model('File');
    const fileData = {
      title: req.body.title,
      description: req.body.description,
    };

    File.create(fileData, function(err, newFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json(newFile);
    });
  });
  ```
  [Documentation for mongoose Model.create](http://mongoosejs.com/docs/api.html#model_Model.create)

  Restart the server, go back to our website and add a new File.  Our list of files should update.  We can reload the page and/or restart the server and we will still have our newly added file in the list.
