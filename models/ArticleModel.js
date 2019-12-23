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
  },
  { // https://github.com/StephenGrider/Lyrical-GraphQL/issues/17#issuecomment-413799895
    usePushEach : true
  }
);

module.exports = mongoose.model('Article', articleSchema);
