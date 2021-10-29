const mongoose = require('mongoose');
const mailSchema = mongoose.Schema({
  mail:
    { type: String },
  tempcode:
    { type: String, },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: 120 },
  },
});

module.exports = mongoose.model('mailModel', mailSchema);