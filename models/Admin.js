/* 管理员模型 */
const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const adminSchema = new Schema({
  adminId: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 16,
    index: true
  },
  adminPwd: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    default: 'cc'
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

module.exports = mongoose.model("Admin", adminSchema, "admin")
