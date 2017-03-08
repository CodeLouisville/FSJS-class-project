const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  title: String,
  updated_at: { type: Date, default: Date.now },
});

const File = mongoose.model('File', FileSchema);

// Seed the database if empty
File.count({}, function(err, count) {
  if (err) {
    throw err;
  }

  if (count > 0) return ;

  const files = require('./file.seed.json');
  File.create(files, function(err, newFiles) {
    if (err) {
      throw err;
    }
  });
});

module.exports = File
