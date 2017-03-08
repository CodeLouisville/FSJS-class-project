// src/routes/index.js
const mongoose = require('mongoose');
const router = require('express').Router();
const fileController = require('./controllers/file.controller');

module.exports = router;

const files = [
  {filename: 'file1.jpg', title:'awesome file 1'},
  {filename: 'file2.jpg', title:'awesome file 2'},
  {filename: 'file3.jpg', title:'awesome file 3'},
];


router.get('/tester', function(req, res, next) {
  console.log('a');
  next();
})
router.get('/tester', function(req, res, next) {
  console.log('b');
  next();
})
router.get('/tester', function(req, res, next) {
  console.log('c');
  res.end('done');
})


router.get('/files', fileController.list);
router.post('/files', fileController.create);
router.put('/files/:fileId', fileController.update);
router.delete('/files/:fileId', fileController.delete);

// GET /hello/1234lskjdhfssldklsd/
//
// router.use('/hello/:myparam', function(req, res, next) {
//   res.end(`Hello ${req.params.myparam}`);
// });

// router.use('/hello', function(req, res, next) {
//   res.end('Hello Code Louisville!!!');
// });
//
// router.use('/data', function(req, res, next) {
//   const myData = {
//   	"title": "Example Schema",
//   	"type": "object",
//   	"properties": {
//   		"firstName": {
//   			"type": "string"
//   		}
//   	},
//   	"required": ["firstName", "lastName"]
//   }
//
//   res.json(myData);
// });

router.get('/', (req,res) => {
  res.render('index',
    {title: 'This is the title',
    message: 'We survived week 3'});
});

router.use(function(req, res, next) {
  res.format({
    html: () => res.send(`
      <h1>Our Project</h1>
      <ul>
        <li>GET a list of files (including meta data)</li>
        <li>EDIT a file (the meta data)</li>
        <li>UPLOAD a file</li>
        <li>DELETE a file</li>
      </ul>
      `)
  })
});
