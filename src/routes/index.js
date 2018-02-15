// src/routes/index.js
const router = require('express').Router();

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
  res.json(FILES);
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
  const newId = '' + FILES.length;
  const data = req.body;
  data.id = newId;

  FILES.push(data);
  res.status(201).json(data);
});

/**
 * Update an existing file
 */
router.put('/file/:fileId', function(req, res, next) {
  res.end(`Updating file '${req.params.fileId}'`);
});

/**
 * Delete a file
 */
router.delete('/file/:fileId', function(req, res, next) {
  res.end(`Deleting file '${req.params.fileId}'`);
});


module.exports = router;

