# FSJS Week 6 - You had me at update/You delete me.

**Outline**

1. Set up for week6
3. Create a form to edit files
2. Create the Update endpoint and connect it to the front-end
2. Create the Delete endpoint and connect it to the front-end


## 1. Setup Project
1. Get the latest version of the group project
    ```
    git clone https://github.com/CodeLouisville/FSJS-class-project.git
    ```

    or if you already have a clone repository
    ```
    git pull
    ```

1. Remove `week6` (because we are going to recreate it today) and copy `week5` to `week6`
    ```
    rm -rf week6
    cp -r week5 week6
    cd week6
    ```

3. Install packages
    ```
    npm install
    ```

5. Start application
    ```
    node index.js
    ```


## Create a form

### Give our Angular app the ability to select an active file
1. Edit `public/js/template/file-list.template.html` so that each repeated `<li>` element has a click-handlers.  The directive to use is `ng-click="$ctrl.selectFile(file)"`.  The `<li>` element should look like:
    ```html
    <li ng-repeat="file in $ctrl.files" ng-click="$ctrl.selectFile(file)">
      <h2>{{file.title}}</h2>
      <p>{{file.filename}}</p>
    </li>
    ```
    **ng-click:** https://docs.angularjs.org/api/ng/directive/ngClick

2. Add a small function in our component (`public/js/component/file-list.component.js`) to output the passed argument:
    ```javascript
    this.selectFile = (file) => {
      console.log("I GOT A FILE!!!!", file);
    }
    ```

3. Reload the page, open a console window (`cmd-opt-I` or `ctrl-shift-I`), and click on a few files to test;

4. Alter the function to unselect any currently selected file, and select the current file.
    ```javascript
    this.selectFile = (file) => {
      // get the currently selected file and set the `selected`
      // property to false
      const currentlySelected = this.selectedFile;
      this.selectedFile = null;

      // Mark the passed file as selected
      if (!currentlySelected || currentlySelected._id !== file._id) {
        this.selectedFile = angular.copy(file);
      }
    }
    ```

5. When a file is selected, we want its list item to change appearance.  We'll do that by adding a class to the `<li>` element with the following directive: `ng-class="{selected: file === $ctrl.selectedFile}"`
    ```html
    <li
      ng-repeat="file in $ctrl.files"
      ng-click="$ctrl.selectFile(file)"
      ng-class="{selected: file._id === $ctrl.selectedFile._id}">
      <h2>{{file.title}}</h2>
      <p>{{file.filename}}</p>
    </li>
    ```
    And update our css file `public/css/style.css`:
    ```css
    li {
    	cursor: pointer;
    }
    li.selected {
    	background-color: pink
    }
    ```
    **ng-class:** https://docs.angularjs.org/api/ng/directive/ngClass

### Create a form that shows the selected file
1. Create a section that only shows up when a file is selected.
    ```html
    <!-- public/js/template/file-list.template.html -->
    <div ng-show="$ctrl.selectedFile">
      <h4>Editing: {{$ctrl.selectedFile.title}}</h4>
    </div>
    ```
    **ng-show:** https://docs.angularjs.org/api/ng/directive/ngShow

2. Reload and click around.

3. Add a form:
    ```html
    <div ng-show="$ctrl.selectedFile">
      <h4>Editing: {{$ctrl.selectedFile.title}}</h4>
      <fieldset>
        <div>
          <label>Title: <input ng-model="$ctrl.selectedFile.title" /></label>
        </div>
        <div>
          <label>Filename: <input ng-model="$ctrl.selectedFile.filename" /></label>
        </div>
        <div>
          <button ng-click="$ctrl.updateFile($ctrl.selectedFile)">Update File</button>
          <button ng-click="$ctrl.deleteFile($ctrl.selectedFile)">Delete</button>
        </div>
      </fieldset>
    </div>
    ```
    **ng-model:** https://docs.angularjs.org/api/ng/directive/ngModel

4. Create a stub of a 'submit' form in our component:
    ```javascript
    this.updateFile = (file) => {
      console.log("I am PUT-ing", file);
    }

    this.deleteFile = (file) => {
      console.log("I am DELETE-ing", file);
    }
    ```

5. Reload and test

## Create the update endpoints

### Create the controller

1. Create a directory under routes: `src/routes/controllers`:
    ```
    mkdir src/routes/controllers
    ```

2. Create a file for our controllers
    ```
    touch src/routes/controllers/file.controller.js
    ```

3. Copy our existing `GET` controller from `src/routes/index.js` and export it from `file.controller.js`
    ```javascript
    const mongoose = require('mongoose');

    module.exports = {
      // List all files in the database
      list: function(req, res, next) {
        mongoose.model('File').find(function(err, files) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }

          res.json(files);
        });
      },
    }
    ```
    **The Module Object:** https://nodejs.org/api/modules.html#modules_the_module_object

4. Import our controller and use that in the route:
    ```javascript
    const fileController = require('./controllers/file.controller');
    //...
    router.get('/files', fileController.list);
    ```

5. Restart the server and test that you can still list files

6. Create a route in `/src/routes/index.js` that handles `PUT` requests, and use an currently-not-existing controller:
    ```javascript
    router.put('/files/:fileId', fileController.update);
    ```

7. Now create the `update` controller in `/src/routes/controllers/file.controller.js`
    ```javascript
    module.exports = {

      // ...

      // Update a file
      update: function(req, res, next) {
        const fileId = req.params.fileId;
        const updatedFile = req.body.file;

        mongoose.model('File').findById(fileId, function(err, file) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }

          file.title = updatedFile.title;
          file.filename = updatedFile.filename;

          file.save(function(err, file) {
            if (err) {
              console.log(err);
              res.status(500).json(err);
            }

            res.json(file);
          });
        });
      },
    }
    ```
    **Model.findById():** http://mongoosejs.com/docs/api.html#model_Model.findById

### Hook up the front-end to the back end
1. First, move the bit of code which was responsible for getting the list of files in to its own function, so that it can be called whenever needed.  Also, make sure to call that function right after creation.
    ```javascript
    this.getFiles = () => {
      return $http.get("/files").then(function(response){
        return self.files=response.data;
      });
    }
    this.getFiles();
    ```

2. In `public/js/component/file-list.component.js`, replace the `updateFile` stub with the following code:
    ```javascript
    this.updateFile = (file) => {

      $http.put(`/files/${file._id}`, {file})
        .then(response => {
          console.log("Successfully updated file");
          return this.getFiles();
        })
        .catch(err => {
          console.log("Oops...there was an error", err);
        })
    }
    ```
    **$http.put:** https://docs.angularjs.org/api/ng/service/$http#put

3. Restart server, reload page and test

## Create the delete endpoints

### Create the controller
1. Go back to `src/routes/index` and add the following route:
    ```javascript
    router.delete('/files/:fileId', fileController.delete);
    ```

2. Create the controller in `/src/routes/controllers/file.controller.js`
    ```javascript
    {

      // ...

      // Delete a file
      delete: function(req, res, next) {
        const fileId = req.params.fileId;

        mongoose.model('File').findById(fileId, function(err, file) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }

          file.remove(function(err, file) {
            if (err) {
              console.log(err);
              res.status(500).json(err);
            }

            res.json(file);
          })
        })
      }
    }
    ```
    **Document.remove():** http://mongoosejs.com/docs/api.html#model_Model-remove

3. In `public/js/component/file-list.component.js`, replace the `deleteFile` stub with the following code:
    ```javascript
    this.deleteFile = (file) => {
      $http.delete(`/files/${file._id}`)
        .then(response => {
          console.log("Successfully deleted file");
          this.selectedFile = null;
          return this.getFiles();
        })
        .catch(err => {
          console.log("Drat...there was an error", err);
        })
    }
    ```
