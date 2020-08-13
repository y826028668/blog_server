const VisitCount = require('../models/visitCount')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Mood = require('../models/Mood')
const Msg = require('../models/Msg')


exports.getDataNum = async function () {
  const visit = await VisitCount.find({isDelete: false})
  const postNum = await Post.find({isDelete: false}).countDocuments()
  const commentNum = await Comment.find({isDelete: false}).countDocuments()
  const moodNum = await Mood.find({isDelete: false}).countDocuments()
  const msgNum = await Msg.find({isDelete: false}).countDocuments()
  let visitNum = 0
  visit.forEach(e => {
    visitNum += e.count
  })
  return {
    visitNum,
    postNum,
    commentNum,
    moodNum,
    msgNum
  }
}
