# FSJS Week 7 - Change is the Only Constant

**Outline**

1. Set up for week7
2. Every file item has an edit button
3. Function to push changes to the server
3. PUT endpoint


## 1. Setup Project
1. (optional) Clone the project
```
git clone https://github.com/CodeLouisville/FSJS-class-project.git
cd FSJS-class-project
```

  **OR** if you need to ditch your current changes and pull a fresh copy down, try this:
  ```
  git stash
  git pull
  ```

2. Get rid of `week7` (we're going to rebuild it)
```
rm -rf week7
```

3. Copy `week6` to `week7`
```
cp -R week6 week7
cd week7
```

4. Install dependencies
```
npm install
```

**Strategy:**
* A User will visit the site and see an edit button beside each file.
* Clicking on this button will cause a form (previously not visible) to appear.
* This will be the same form that adds a new File.
* That form will have all the current information for the selected file
* Our user will use that form to edit the existing File.
* The `Submit` button will trigger a javascript function that grabs the data from the form and PUTs it to an API endpoint
* After PUTting the data and receiving a response, the page will refresh the list of Files.

## 2. Add an edit button to each item.

1. Open `public/index.html` and find the `#list-template` handlebars template we use to render the list of files.  Add a button to each item.
```html
<li class="list-group-item">
  <strong>{{title}}</strong> - {{description}}
  <span class="pull-right">
    <button type="button" class="btn btn-xs btn-default">Edit</button>
  </span>
</li>
```

2. Add some functionality to that button.  Add an `onclick` event handler and its corresponding function.
```html
<button type="button" class="btn btn-xs btn-default" onclick="editFileClick()">Edit</button>
```
And the function goes in `/public/js/app.js`
```javascript
function editFileClick() {
  console.log("I will edit for you!");
}
```

This works, but every 'Edit' does the exact same thing when clicked.  We want a click to (eventually) open a form with the data for a specific file.  We need somehow get the File data in to our `editFileClick()` function.  There are dozens of ways of accomplishing this.  Here's a straight-forward method:  

Pass the unique File `_id` field to our function in the `onclick` event handler.  Then use that id to find the File in an array.  We'll need to make sure we have an array of File objects available.

3. Pass the `_id` parameter to the funciton
  ```html
  <button type="button" class="btn btn-xs btn-default" onclick="editFileClick('{{_id}}')">Edit</button>
  ```
  And now `console.log()` the result to show it works
  ```javascript
  function editFileClick(id) {
    console.log("I will edit for you", id);
  }
  ```

  Take a look at the edit button element to see what's going on here.

4. Whenever we refresh the list of Files (remember our AJAX call), save that array to a property on the global `window` object.  This is done in `refreshFileList()`
```javascript
function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}
```

5. In our `onclick` handler, retrieve the file using `Array.find()`
```javascript
function editFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    console.log("I will edit you!", file);
  } else {
    console.log("Aw shucks, I didn't find", id)
  }
}
```
[Documentation for Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?v=control)

  Refresh the page and click on a few `Edit` buttons to see that it works.


6. Edit the `editFileClick()` function so that it opens the form we created last week.  When clicked, we should also populate the form with the data we wish to edit.
  ```javascript
  function editFileClick(id) {
    const file = window.fileList.find(file => file._id === id);
    if (file) {
      $('#file-title').val(file.title);
      $('#file-description').val(file.description);
      toggleAddFileFormVisibility();
    }
  }
  ```

7. Hey, what about the `_id` field?  That seems important.  Add a hidden input to the form and set that when we click edit.
  ```html
  <form id="add-file-form">
    <input type="hidden" id="file-id" value="" />
    ...
  ```

  ```javascript
  function editFileClick(id) {
    const file = window.fileList.find(file => file._id === id);
    if (file) {
      $('#file-title').val(file.title);
      $('#file-description').val(file.description);
      $('#file-id').val(file._id);
      toggleAddFileFormVisibility();
    }
  }
  ```

8. Problem, what if we click `Edit`, close the form and then try to add a new File? When we click `Add File` we expect to see a blank form, but instead we see data from the previously edited File.  Since we are reusing this form, we need a way to clear the data.  Let's pull all the logic for setting a form's data out in to it's own function.
  ```javascript
  function setFormData(data) {
    data = data || {};

    const file = {
      title: data.title || '',
      description: data.description || '',
      _id: data._id || '',
    };

    $('#file-title').val(file.title);
    $('#file-description').val(file.description);
    $('#file-id').val(file._id);
  }
  ```
  Now, we use that function in `editFileClick()` and `toggleAddFileForm()`

  ```javascript
  function toggleAddFileForm() {
    console.log("Baby steps...");
    setFormData({});
    toggleAddFileFormVisibility();
  }
  ```
  ```javascript
  function editFileClick(id) {
    const file = window.fileList.find(file => file._id === id);
    if (file) {
      setFormData(file);
      toggleAddFileFormVisibility();
    }
  }
  ```

## Push our changes to the server.

  Most of the hard work on the front-end has been done.  Really, the only difference between creating a new file and editing an existing one is that when creating, we `POST` to the server and we don't have an `_id` field, while when editing, we `PUT` to the server AND the URL is slightly different (we add the `_id` field to the url).

  We can accomplish this by checking to see if `#file-id` has a value.  If it does, we are editing, if it doesn't we are creating.

1. In `submitFileForm()` get the `#file-id` value and check if we are PUTting or POSTing
  ```javascript
  function submitFileForm() {
    console.log("You clicked 'submit'. Congratulations.");

    const fileData = {
      title: $('#file-title').val(),
      description: $('#file-description').val(),
      _id: $('#file-id').val(),
    };

    let method, url;
    if (fileData._id) {
      method = 'PUT';
      url = '/api/file/' + fileData._id;
    } else {
      method = 'POST';
      url = '/api/file';
    }

    $.ajax({
      type: method,
      url: url,
      data: JSON.stringify(fileData),
      dataType: 'json',
      contentType : 'application/json',
    })
      .done(function(response) {
        console.log("We have posted the data");
        refreshFileList();
        toggleAddFileForm();
      })
      .fail(function(error) {
        console.log("Failures at posting, we are", error);
      })

    console.log("Your file data", fileData);
  }
  ```
  That should do it, but when we try to submit an error, we get a 404 response.  We have to create the PUT endpoint.


## Handle that PUT

1. In `/src/routes/index.js`, clear out our previous, Array-based `PUT /api/file/:fileId` route:
  ```javascript
  router.put('/file/:fileId', function(req, res, next) {

  });
  ```

2. Our strategy here is to find the file we're trying to edit in the database, then edit it, then save it
  ```javascript
  router.put('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
  const fileId = req.params.fileId;

  File.findById(fileId, function(err, file) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    file.title = req.body.title;
    file.description = req.body.description;

    file.save(function(err, savedFile) {
      res.json(savedFile);
    })

  })
});
```
