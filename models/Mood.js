/* 心情短语模型 */
const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const moodSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: Date,
    default: +moment.utc()
  },
  isDelete: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("Mood", moodSchema, "mood")
