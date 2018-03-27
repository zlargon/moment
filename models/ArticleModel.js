const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  comment: Array,
  like: Array
});

module.exports = mongoose.model('Article', articleSchema);
