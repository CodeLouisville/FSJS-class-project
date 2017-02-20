# FSJS Week 5 - Mongo!!!!

**Outline**

2. Install Mongo (Go ahead and start on this)
1. Set up for week5
3. Create a model and seed it with data
4. Connect Mongo to our application

## 1. Install Mongo
**Windows**:  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

**Linux**
 https://docs.mongodb.com/manual/administration/install-on-linux/

**OSX**
 https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/


## 2. Setup Project
1. Get the latest version of the group project
    ```
    git clone https://github.com/CodeLouisville/FSJS-class-project.git
    ```

    or if you already have a clone repository
    ```
    git pull
    ```

1. Remove `week5` (because we are going to recreate it today) and copy `week4` to `week5`
    ```
    rm -rf week5
    cp -r week4 week5
    cd week5
    ```

3. Install packages
    ```
    npm install
    ```

4. Install mongoose
    ```
    npm install mongoose --save
    ```
    **Mongoose Documentation:** http://mongoosejs.com/docs/api.html

5. Start application
    ```
    node index.js
    ```


## Create a model

### Configure our app to work with mongo
1. Edit our config file (at `src/config/index.js`) so that the returned configuration object includes mongo configuration:
    ```javascript
    const config = {
      appName: 'My awesome app',
      port: 8080,
      db: {
        host: 'localhost',
        dbName: 'fsjs',
      }
    };
    ```

2. Connect to mongo through the mongoose library.  In `src/server.js`, import mongoose with
    ```javascript
    // Load mongoose package
    const mongoose = require('mongoose');
    ```
    Then, connect with the following
    ```javascript
    // Connect to MongoDB and create/use database as configured
    mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`);
    ```


### Build the model

1. In the `src/models` directory, create an empty file called `file.model.js`
2. Within that file, pull in mongoose
    ```javascript
    // Load mongoose package
    const mongoose = require('mongoose');
    ```
    
3. Create a schema
    ```javascript
    const FileSchema = new mongoose.Schema({
      filename: String,
      title: String,
      updated_at: { type: Date, default: Date.now },
    });
    ```
    
4. Turn that schema in to a mongoose model, register it, and export it
    ```javascript
    const File = mongoose.model('File', FileSchema);
    module.exports = File
    ```
    
5. Make sure that the `file.model.js` script is run by `require`-ing it somewhere...like in `src/server.js`
    ```javascript
    // Import all models
    require('./models/file.model.js');
    ```

## Connect to our app
1. In `src/routes.index.js`, pull in mongoose at the top of the file.
    ```javascript
    const mongoose = require('mongoose');
    ```
    
2. Edit the `GET /files` route.  Replace our development code with
    ```javascript
    mongoose.model('File').find({}, function(err, files) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }

      res.json(files);
    });
    ```
    **Model.find:** http://mongoosejs.com/docs/api.html#model_Model.find

3. Restart server and test

### What about some test data?
Strategy: On startup, check if there are any files in the database, if not, then add files from a seed file.

1. Create a file in `/src/models` called `file.seed.json`
    ```json
    [
      {"filename": "file1.jpg", "title":"Mongo file 1"},
      {"filename": "file2.jpg", "title":"Mongo file 2"},
      {"filename": "file3.jpg", "title":"Mongo file 3"}
    ]
    ```

2. In `file.model.js`, get the current count of documents in the collection
    ```javascript
    File.count({}, function(err, count) {
      if (err) {
        throw err;
      }
      // ...
    });
    ```
    **Model.count:** http://mongoosejs.com/docs/api.html#model_Model.count

3. Add the seed data
    ```javascript
    const files = require('./file.seed.json');
    File.create(files, function(err, newFiles) {
      if (err) {
        throw err;
      }
    });
    ```
    **Model.create:** http://mongoosejs.com/docs/api.html#model_Model.create
