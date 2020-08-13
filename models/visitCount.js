/* 站点访问数量统计 */
const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema;

const VisitCountSchema = new Schema({
  userIp: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: String
  },
  count: {
    type: Number,
    default: 1
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

module.exports = mongoose.model("VisitCount", VisitCountSchema, "visitCount")
