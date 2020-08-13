/* 置顶文章模型 */
const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema;

const topPostSchema = new Schema({
  postId: {
    type: String,
    required: true,
    index: true
  },
  title: String,
  tag: String,
  author: String,
  imgSrc: String,
  parent: String,
  time: {
    type: Date,
    default: +moment.utc()
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("TopPost", topPostSchema, "topPost")
