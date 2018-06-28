# FSJS Week 7 - Change is the Only Constant

**Outline**

1. Set up for week7
2. Every file item has an edit button
3. Function to push changes to the server
3. PUT endpoint


## 1. Setup Project
```
git stash
git checkout -f week7
git pull
npm install
```

**Strategy:**
* A User will visit the site and see an edit button beside each file.
* Clicking on this button will cause the Add File form to be populated with the file data
* Our user will use that form to edit the existing File.
* The `Submit` button will trigger a javascript function that grabs the data from the form and PUTs it to an API endpoint
* After PUTting the data and receiving a response, the page will refresh the list of Files.

## 2. Add an edit button to each item.

1. We need to edit the template that outputs each file item.  Open `public/js/app.js` and edit the template found in the `renderFiles` function. Add a button to each item.
```javascript
function renderFiles(files) {
  const listItems = files.map(file => `
    <li class="list-group-item">
      <strong>${file.title}</strong> - ${file.description}
      <span class="pull-right">
        <button type="button" class="btn btn-xs btn-default">Edit</button>
      </span>
    </li>`);
  const html = `<ul class="list-group">${listItems.join('')}</ul>`;

  return html;
}
```

2. Add some functionality to that button.  Add an `onclick` event handler and its corresponding function.
```html
<button type="button" class="btn btn-xs btn-default" onclick="handleEditFileClick()">Edit</button>
```

And the function goes in `/public/js/app.js`
```javascript
function handleEditFileClick() {
  console.log("I will edit for you!");
}
```

This works, but every 'Edit' does the exact same thing when clicked.  We want a click to (eventually) fill the form with the data for a specific file.  We need somehow get the File data in to our `handleEditFileClick()` function.  There are dozens of ways of accomplishing this.  Here's a straight-forward method:  

Add a custom attribute called `data-file-id` to the button.  Make the value of that attribute equal to the `_id` field of the file.  Pass the element (using `this`) to the `handleEditFileClick` function and pull the `_id` field from the element.  Then use that id to find the File in an array.  We'll need to make sure we have an array of File objects available.

3. Pass the `_id` parameter to the funciton
  ```html
  <button type="button" class="btn btn-xs btn-default" onclick="handleEditFileClick(this)" data-file-id="${file._id}">Edit</button>
  ```

  And now `console.log()` the result to show it works
  ```javascript
  function handleEditFileClick(element) {
    const fileId = element.getAttribute('data-file-id');
    console.log("I will edit for you", fileId);
  }
  ```

  Take a look at the edit button element to see what's going on here.

4. Whenever we refresh the list of Files (remember our AJAX call), save that array to a property on the global `window` object.  This is done in `refreshFileList()`
```javascript
function refreshFileList() {
  getFiles()
    .then(files => {

      window.fileList = files;

      const html = renderFiles(files);
      $('#list-container').html(html);
    });
}
```

5. In our `onclick` handler, retrieve the file using `Array.find()`
```javascript
function handleEditFileClick(element) {
  const fileId = element.getAttribute('data-file-id');

  const file = window.fileList.find(file => file._id === fileId);
  if (file) {
    console.log("I will edit you!", file);
  } else {
    console.log("Aw shucks, I didn't find", fileId)
  }
}
```
[Documentation for Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?v=control)

  Refresh the page and click on a few `Edit` buttons to see that it works.


6. Edit the `handleEditFileClick()` function so that it opens the form we created last week.  When clicked, we should also populate the form with the data we wish to edit.
  ```javascript
  function handleEditFileClick(element) {
    const fileId = element.getAttribute('data-file-id');

    const file = window.fileList.find(file => file._id === fileId);
    if (file) {
      $('#file-title').val(file.title);
      $('#file-description').val(file.description);
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
  function handleEditFileClick(element) {
    const fileId = element.getAttribute('data-file-id');

    const file = window.fileList.find(file => file._id === fileId);
    if (file) {
      $('#file-title').val(file.title);
      $('#file-description').val(file.description);
      $('#file-id').val(file._id);
    }
  }
  ```

## Two quick problems

1. We forgot to add the ability to clear the form
2. We can't really tell if we are adding or editing a file

We can solve the first problem by setting all the form fields to blank.
```javascript
function setForm() {
  $('#file-title').val('');
  $('#file-description').val('');
  $('#file-id').val('');
}
```

**BUT WAIT!**
That looks remarkably like the code we used in `handleEditFileClick()`.  With a small change, we can reuse this function:
```javascript
function setForm(data) {
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

If we don't pass anything to setForm, all the fields get empty strings.  If we pass a file to the function, then the form gets populated.  Now we can use that...

...in `handleEdifFileClick`
```javascript
function handleEditFileClick(element) {
    const fileId = element.getAttribute('data-file-id');

    const file = window.fileList.find(file => file._id === fileId);
    if (file) {
      setForm(file)
    }
  }
```

... in `cancelFileForm`
```javascript
function cancelFileForm() {
  setForm();
}
```

...in `submitFileForm` (to clear the data when we are done)
```javascript
function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");
 
  const fileData = {
    title: $('#file-title').val(),
    description: $('#file-description').val(),
  };
 
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
      setForm();
      refreshFileList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
}
```

...and just to be complete, set the form on page load:
```javascript
$(document).ready(function () {
  refreshFileList();
  setForm();
});
```

But what about the second problem?  Hey, we gotta solution for that too.  

**Strategy:**
Every time the form is set, check if there is an `_id` field.  
If yes, then the form is editing.  If no, then the form is adding. 
Change the form legend accordingly.

1. Add an `id` field to the legend element
```html
<legend id="form-label">File</legend>
```

2. Add a little logic to `setForm` the set the legend text
```javascript
function setForm(data) {
  data = data || {};

  const file = {
    title: data.title || '',
    description: data.description || '',
    _id: data._id || '',
  };

  $('#file-title').val(file.title);
  $('#file-description').val(file.description);
  $('#file-id').val(file._id);

  if (file._id) {
    $('#form-label').text("Edit File");
  } else {
    $('#form-label').text("Add File");
  }
}
```

Voila.

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
 
  fetch(url, {
    method: method,
    body: JSON.stringify(fileData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(file => {
      console.log("we have updated the data", file);
      setForm();
      refreshFileList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
}
```
That should do it, but when we try it, we get an error.  Why?


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
      console.error(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    file.title = req.body.title;
    file.description = req.body.description;

    file.save(function(err, savedFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedFile);
    })

  })
});
```
