# FSJS Week 8 - Delete the negative; Accentuate the positive!

**Outline**

1. Set up for week8
2. What is a soft delete?
3. Update our model and handlers
4. Delete handler
5. Baby-step our way to a delete button


## 1. Setup Project
1. Clear changes made last week
```
git reset --hard HEAD
git clean -f
```

2. Check out a clean week8 branch
```
git fetch
git checkout -fb week8 origin/week8
git pull
npm install
```

## 2. What is a soft delete

**Deleting Can Be Hazardous to your Health**
It is difficult to make deleting (as in, actually removing something from the database) save.  Meaning, if you give users the ability to destroy data, eventually they will do it by accident.  Without some means of recovering that data, deleting can make managers and clients sad.

**So Don't Do It**
Simply mark a database entry as `deleted` instead.  That way, you can exclude "deleted" items from your searches AND recover those items (undelete with ease).

## 3. So let's apply that idea to our model
1. In `/src/models/file.model.js`, update our model so that it has a `deleted` field:
```javascript
const FileSchema = new mongoose.Schema({
  title: String,
  description: String,
  created_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false}
});
```

2. Now make sure that our route handlers know to exclude "deleted" items. In `src/routes/index.js` update the `GET /file` handler:
```javascript
router.get('/file', function(req, res, next) {
  const File = mongoose.model('File');
  
  File.find({deleted: {$ne: true}}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(files);
  });
});
```
So, why not just `{deleted: false}`?
[Documentation for Mongo's $ne operator](https://docs.mongodb.com/manual/reference/operator/query/ne/)

## 4. Let's do some deleting
1. We can now update the `DELETE /file/:fileId` handler in `src/routes/index.js` to actually do something.  Since we aren't removing the file, "deleting" will basically be updating the file.  In other works `DELETE /file/:fileId` will look really similar to `PUT /file/:fileId`:
```javascript
router.delete('/file/:fileId', function(req, res, next) {
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

    file.deleted = true;

    file.save(function(err, doomedFile) {
      res.json(doomedFile);
    })

  })
});
```
How would you implement an `undelete` operation?

## 5. Baby-step our way through the front-end stuff
1. Make a "Delete" button appear by each file, just next to the "Edit" button.  Open `public/index.html` and add this just after the edit button
```html
<button type="button" class="btn btn-xs btn-danger">Del</button>
```

2. Now make it do something by adding an `onclick` handler (we can copy/paste from the "Edit" button and then change it to suit our needs):
```html
<button type="button" class="btn btn-xs btn-danger" onclick="handleDeleteFileClick('{{_id}}')">Del</button>
```

3. Create the `handleDeleteFileClick()` function in `public/js/app.js`:
```javascript
function handleDeleteFileClick(id) {
  console.log("File", id, "is DOOMED!!!!!!");
}
```

4. Er....maybe we should ask for confirmation before doing this:
```javascript
function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    console.log("File", id, "is DOOMED!!!!!!");
  }
}
```

5. Much better.  Now instead of logging out a message, let's send an ajax `DELETE` message to `/file/:fileId` to have the file deleted:
```javascript
function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}
```

6. Aaaaand we'll create that function (We can look at `submitFileForm()` to remind ourselves how to do it):
```javascript
function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("File", id, "is DOOMED!!!!!!");
      refreshFileList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}
```
