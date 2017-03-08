const mongoose = require('mongoose');
const File = require('../../models/file.model');

module.exports = {
  // List all files in the database
  list: function(req, res, next) {
    File.find(function(err, files) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }

      res.json(files);
    });
  },

  // Create a file
  create: function(req, res, next) {
    const newFile = req.body.file;

    const newFileModel = new File(newFile);
    newFileModel.save(function (err) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        res.json(newFileModel);
      }
    });
  },

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
