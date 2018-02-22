# FSJS Week 6 - Something from Nothing

**Outline**

1. Set up for week6
2. Create a hidable form to add files
4. Client-side function to POST a new files
5. Server-side handler that creates file


## 1. Setup Project
1. Clear changes made last week
```
git reset --hard HEAD
git clean -f
```

2. Check out a clean week6 branch
```
git fetch
git checkout -fb week5 origin/week5
git pull
npm install
```

**Strategy:** 
* A User will visit the site and see a button that reads `Add File`.  
* Clicking on this button will cause a blank form (previously not visible) to appear.  
* Our user will use that form to add a new File to the database.  
* The form has fields for `title` and `description` fields, a `Submit` and a `Cancel` button.  
* The `Submit` and `Cancel` buttons do exactly what you think they would do.  
 * The `Submit` button will trigger a javascript function that grabs the data from the form and POSTs it to an API endpoint (we already have one...remember it?)
 * After POSTing the data and receiving a response, the page will refresh the list of Files.
 * The `Cancel` button will close the form without POSTing the data
* Clicking the `Add File` button while the form is open has the same effect as clicking `Cancel.`

## 2. Create a form


1. Clean up the look of our webpage by taking advantage of bootstrap's `.container`.  Open `public/index.html` and make the first two lines of the `<body>` look like this:
  ```html
  <div class="container">
    <h1>A wild webpage appears...</h1>
    <div id="list-container"></div>
  </div>
  ```

2. Add a button that calls a function when clicked below the file list.
  ```html
  <button id="add-file-button" class="btn btn-primary">Add File</button>
  ```
  
3. We need that button to do something when we click it.  Add an `onclick` handler:
  ```html
  <button id="add-file-button" class="btn btn-primary" onclick="toggleAddFileForm()">Add File</button>
  ```

3.  What's that `toggleAddFileForm()` function? We have to create it.  Add the following code to the file we created to house our code: `public/js/app.js`.
  ```javascript
  function toggleAddFileForm() {
    console.log("Baby steps...");
  }
  ```
  Refresh the page, open a console, and click the button a few times.

4. Add a section of HTML that will appear and disappear on command.  Add this below the `Add File` button.
  ```html
  <div id="form-container" class="panel hidden">
    Really...someone should put a form here...
  </div>
  ```
  If you refresh the page, nothing will appear because of bootstrap's `.hidden` class.

5. Create a javascript function to toggle the visibility of the form container:
  ```javascript
  function toggleAddFileFormVisibility() {
    $('#form-container').toggleClass('hidden');
  }
  ```

  And call that function within `toggleAddFileForm()`
  ```javascript
  function toggleAddFileForm() {
    console.log("Baby steps...");
    toggleAddFileFormVisibility();
  }
  ```

6. Now insert a form into the `#form-container`
  ```html
  <form id="add-file-form">
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
  ```
  Reload the browser and look at our beautiful form.  

7. What about those `onclick` functions?  We already know what 'cancel' should do (close the form), but will figure out what `submit` does later.
  ```javascript
  function submitFileForm() {
    console.log("You clicked 'submit'. Congratulations.");
  }

  function cancelFileForm() {
    toggleAddFileFormVisibility();
  }
  ```

  At this point, we should have 4 more simple functions in `public/js/app.js` that barely do anything. Let's change that by collecting the form data when we click `submit`:

8. Add the following to our `submitFileForm` function after the `console.log` line:
  ```javascript
 function submitFileForm() {
   console.log("You clicked 'submit'. Congratulations.");

   const title = $('#file-title').val();
   const description = $('#file-description').val();
   const fileData = {
     title: title,
     description: description,
   };

   console.log("Your file data", fileData);
 }
 ```

## jQuery, our POSTing hero

We're going to POST json-formatted data to an endpoint on our server which will do all the hard work.  We already have a `POST /api/file` route, but currently it appends the file data to a static array (remember?  We never changed that).

First, we'll use jquery to POST the data, then we'll fix our POST route.

1. Add the following to our `submitFileForm` function AFTER we create the fileData object.
  ```javascript
  $.ajax({
    type: "POST",
    url: '/api/file',
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
      toggleAddFileFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    });
  ```
  [Documentation for jquery AJAX](https://api.jquery.com/jquery.ajax/)
  If we refresh the page and test this, it will work, but we won't be updating the displayed list. Remember that we have that static array thing which we've never changed...let's do that now.


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
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(newFile);
    });
  });
  ```
  [Documentation for mongoose Model.create](http://mongoosejs.com/docs/api.html#model_Model.create)

  Restart the server, go back to our website and add a new File.  Our list of files should update.  We can reload the page and/or restart the server and we will still have our newly added file in the list.