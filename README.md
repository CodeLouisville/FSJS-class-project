# FSJS Week 5 - Mongo!!!!

**Outline**

1.  Set up Mongo (Go ahead and start on this)
2.  Set up for week5
3.  Create a model and seed it with data
4.  Connect Mongo to our application

## 1. Set up Mongo

### Option 1 - Create a database at mLab (recommended)

1.  Head over to [mLab](https://mlab.com) (https://mlab.com)
2.  If you have an account, log in, otherwise click on "Sign Up"
3.  Click on "Create New"

- Any cloud provider will do
- Make sure you choose the "Sandbox" plan type
- Click "Continue" at the bottom of the page
- Answer all remaining questions (region, etc.)
- Choose a name...could be anything...maybe "fsjs-class-project"
- Complete setup

4.  Click on your new database in the list and note the connection links provided

### Option 2 - Install mongo on your machine

**Windows**: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

**Linux**
https://docs.mongodb.com/manual/administration/install-on-linux/

**OSX**
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

## 2. Setup Project

### Week 5 Branch

```
git stash
git checkout -f week5
npm install
```

### Install mongoose

npm install mongoose --save

**Mongoose Documentation:** http://mongoosejs.com/docs/api.html

## HOLD THE PHONE...

**What is Mongo? Sounds like a cartoon character's name...**

Mongo is a database. It is a place to store structured data so that your application can quickly and easily find it later. Mongo is known as a no-SQL database. In the case of Mongo, that means that it stores data in units called `documents` - which look just like javascript objects (key-value pairs, nested objects, arrays, etc.).

## WAIT A MINUTE....

**What is this `mongoose` of which you speak?**

Mongoose is an ORM (Object Relational Mapping) tool. It is used in your application to make the process of querying, inserting, updating, and deleting data in a Mongo database. In addition, it turns the plain ol' javascript objects you get back from Mongo in to more feature-rich objects for your application to use.

![Mongoose Diagram](mongoose_diag.png)

## Create a model using mongoose

**In a nutshell, we will:**

1.  Tell mongoose how to talk to the mongo server
2.  Make sure mongoose connects to mongo when your application starts.
3.  Create a "model" in mongoose. This is where you define what your data looks like.
4.  Use Mongo in our route handlers instead of the array we've been using.
5.  Add some test data.

### Configure our app to work with mongo

1.  Edit our config file (at `src/config/index.js`) so that the returned configuration object includes mongo configuration:

    ```javascript
    module.exports = {
      appName: 'Our Glorious Node Project',
      port: 3030,
      db: {
        username: <mLab username>,
        password: <mLab password>,
        host: 'ds159507.mlab.com:59507',
        dbName: 'fsjs-class-project',
      }
    };
    ```

2.  Connect to mongo through the mongoose library. In `src/server.js`, somewhere near the top of the file, import mongoose with the following. Note that when we connect to the mongo server, we are piecing together the connection string handed to us by mLab.
    ```javascript
    // Load mongoose package
    const mongoose = require("mongoose");
    ```
    Then, somewhere AFTER the line where you load your configuration, connect with the following
    ```javascript
    // Connect to MongoDB and create/use database as configured
    mongoose.connection.openUri(
      `mongodb://${config.db.username}:${config.db.password}@${
        config.db.host
      }/${config.db.dbName}`
    );
    ```

### Build the model

1.  In the `src/models` directory, create an empty file called `file.model.js`
2.  At the top of that file, pull in mongoose

    ```javascript
    // Load mongoose package
    const mongoose = require("mongoose");
    ```

3.  Create a schema

    ```javascript
    const FileSchema = new mongoose.Schema({
      title: String,
      description: String,
      created_at: { type: Date, default: Date.now }
    });
    ```

    Notice that the `title` and `description` fields are also present in our faked data (`/src/routes/index.js`). We've also added a new field called `created_at`, which will be a Date and will default to the current time.

4.  Turn that schema in to a mongoose model, register it, and export it

    ```javascript
    const File = mongoose.model("File", FileSchema);
    module.exports = File;
    ```

    A lot is going on here. We are storing the `File` schema inside the mongoose object (which will make it available anywhere in your application). We're also giving a name ("File") so we can distinguish it from any other model we may want to register. We're also exporting the model from this module.

5.  Make sure that the `file.model.js` script is run by `require`-ing it somewhere...like in `src/server.js`, below the line where we connect mongoose to mongo:
    ```javascript
    // Import all models
    require("./models/file.model.js");
    ```

## Connect to our app

1.  In `src/routes/index.js`, pull in mongoose at the top of the file.

    ```javascript
    const mongoose = require("mongoose");
    ```

2.  Edit the `GET /file` route. Replace our development code with

    ```javascript
    mongoose.model("File").find({}, function(err, files) {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(files);
    });
    ```

    **Model.find:** http://mongoosejs.com/docs/api.html#model_Model.find

3.  Restart server and test - **Where did our data go?**

### What about some test data?

Strategy: On startup, check if there are any files in the database, if not, then add files from a seed file.

1.  Create a file in `/src/models` called `file.seed.json`

    ```json
    [
      {
        "title": "Satellite of Love Plans.svg",
        "description": "Includes fix for exhaust port vulnerability"
      },
      { "title": "Rules of Cribbage.doc", "description": "9th edition" },
      { "title": "avengers_fanfic.txt", "description": "PRIVATE DO NOT READ" }
    ]
    ```

2.  In `file.model.js`, after you create and export the model, get the current count of documents in the collection

    ```javascript
    File.count({}, function(err, count) {
      if (err) {
        throw err;
      }
      // ...
    });
    ```

    **Model.count:** http://mongoosejs.com/docs/api.html#model_Model.count

3.  Add the seed data

    ```javascript
    if (count > 0) return;

    const files = require("./file.seed.json");
    File.create(files, function(err, newFiles) {
      if (err) {
        throw err;
      }
      console.log("DB seeded");
    });
    ```

    **Model.create:** http://mongoosejs.com/docs/api.html#model_Model.create

```

```
