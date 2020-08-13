/* 评论模型 */
const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  parentId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 16,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  time: {
    type: Date,
    default: +moment.utc()
  },
  parentCmtId: {
    type: String,
    default: ''
  },
  childrenCmtId: {
    type: String,
    default: ''
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("Comment", commentSchema, "comment")
