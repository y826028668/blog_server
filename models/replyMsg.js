/* 留言回复模型 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  content: {
    type: String
  },
  time: {
    type: Date,
    default: Date.now
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})
