const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: String,
    token: {
      type: String,
      required: true
    },
    article: Array
  },
  { // https://github.com/StephenGrider/Lyrical-GraphQL/issues/17#issuecomment-413799895
    usePushEach : true
  }
);

module.exports = mongoose.model('User', userSchema);
