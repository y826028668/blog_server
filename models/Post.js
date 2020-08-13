/* 文章模型 */
const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema;

const postSchema = new Schema({
  parent: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'cc'
  },
  time: {
    type: Date,
    default: +moment.utc()
  },
  views: {
    type: Number,
    default: 0
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("Post", postSchema, "post")
