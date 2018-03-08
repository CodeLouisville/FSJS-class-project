// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

// Totally fake data
const FILES = [
  {id: 'a', title: 'cutecat1.jpg', description: 'A cute cat'},
  {id: 'b', title: 'uglycat1.jpg', description: 'Just kidding, all cats are cute'},
  {id: 'c', title: 'total_recall_poster.jpg', description: 'Quaid, start the reactor...'},
  {id: 'd', title: 'louisville_coffee.txt', description: 'Coffee shop ratings'},
];


router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

/**
 * Get a list of all files in the DB
 */
router.get('/file', function(req, res, next) {
  const fileModel = mongoose.model('File');

  fileModel.find({}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  
    res.json(files);
  });
});

/**
 * Get a single file by passing its id as a URL param
 */
router.get('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;
  // same as 'const fileId = req.params.fileId'

  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});

/**
 * Create a new file
 */
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

/**
 * Update an existing file
 */
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

/**
 * Delete a file
 */
router.delete('/file/:fileId', function(req, res, next) {
  res.end(`Deleting file '${req.params.fileId}'`);
});


module.exports = router;

