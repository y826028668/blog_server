const Comment = require('../models/Comment')
const Post = require('../models/Post')
const Admin = require('../models/Admin')

/**
 * 获取所有评论
 */
exports.getAllComment = async function () {
  const result = await Comment.find({isDelete: false})
  return result
}

/**
 * 根据文章id分页获取一级评论
 * @param {*} postId 文章id
 * @param {*} pageNum 页码
 * @param {*} cmtNum 每页数据数量
 */
exports.getPostAllComment = async function (postId, pageNum = 1, cmtNum = 6) {
  if(!postId) return null
  const findCmtTotal = await Comment.find({parentId: postId, parentCmtId: "", isDelete: false}).countDocuments()
  if(findCmtTotal === 0) return '无评论'
  const findCmt = await Comment.find({parentId: postId,parentCmtId: "", isDelete: false})
  .sort({time: -1})
  .skip((pageNum - 1) * cmtNum)
  .limit(+cmtNum)
  return {
    total: findCmtTotal,
    data: findCmt
  }
}

/**
 * 获取最新评论
 * @param {*} num 获取数量
 */
exports.getNewComment = async function (num = 5) {
  const result = await Comment.find({isDelete: false}).sort({time: -1}).limit(+num)
  return result
}

/**
 * 新增一条评论
 * 参数对象(obj)中包含parentid、name、email、content
 * @param {*} obj 
 */
exports.addComment = async function (parentId, name, email, content) {
  if(!parentId || !name || !email || !content) return null
  const findPost = await Post.findOne({_id: parentId, isDelete: false})
  if(!findPost) return '找不到该文章'
  const findCmt = await Comment.findOne({name, isDelete: false})
  if(findCmt) return '昵称重复'
  const result = await Comment.create({parentId, name, email, content})
  return result
}

/**
 * 添加一条回复评论
 * 文章id(parentId)
 * 父级评论id(parentCmtId)、
 * 评论内容(name、email、content)
 * @param {*} obj 
 */
exports.replyComment = async function (postId, parentCmtId, name, email, content) {
  if (!postId || !parentCmtId || !name || !email || !content) return null
  const findPost = await Post.findOne({_id: postId, isDelete: false})
  const findParentCmt = await Comment.findOne({_id: parentCmtId, isDelete: false})
  const findCmt = await Comment.findOne({name, isDelete: false})
  if(findCmt) return '昵称重复'
  if(!findPost || !findParentCmt) return '文章或评论不存在'
  const result = await Comment.create({parentId: postId, parentCmtId, name, email, content})
  await Comment.updateOne(
    {_id: parentCmtId, isDelete: false}, 
    {childrenCmtId: result._id},
    {runValidators: true}
  )
  return result
}

/**
 * 简单删除一条评论
 * @param {*} cmtId 评论id
 */
exports.deleteComment = async function (cmtId) {
  if(!cmtId) return null
  const result = await Comment.updateOne({_id: cmtId, isDelete: false}, {isDelete: true}, {runValidators: true})
  return result
}

/**
 * 恢复被简单删除的一条评论
 * @param {*} cmtId 评论id
 */
exports.undeleteComment = async function (cmtId) {
  if(!cmtId) return null
  // const result = Comment.find({_id: cmtId})
  const result = await Comment.updateOne({_id: cmtId, isDelete: true}, {isDelete: false}, {runValidators: true})
  if(result && result.nModified === 1) return '恢复成功'
  else return '恢复失败'
}

/**
 * 彻底删除一条评论
 * 彻底删除为重要操作必须验证登录状态和管理员账号密码
 * @param {*} adminId 管理员账号
 * @param {*} adminPwd 管理员密码
 * @param {*} cmtId 评论id
 */
exports.shiftDeleteComment = async function (adminId, adminPwd, cmtId) {
  if(!cmtId || !adminId || !adminPwd) return null
  const adminIsRight = await Admin.findOne({adminId, adminPwd, isDelete: false})
  const findCmt = await Comment.findOne({_id: cmtId, isDelete: true})
  if(!adminIsRight && !findCmt) return null
  const result = await Comment.deleteOne({_id: cmtId})
  const findCmtParent = await Comment.updateOne({_id: findCmt.parentMsgId}, {childrenMsgId: ''}, {runValidators: true})
  const findCmtChild = await Comment.updateOne({_id: findCmt.childrenMsgId}, {parentMsgId: ''}, {runValidators: true})
  return {
    result,
    findCmtParent,
    findCmtChild
  }
}

/**
 * 获取所有被删除的评论
 */
exports.getDeleteComment = async function () {
  const result = await Comment.find({isDelete: true})
  return result
}

/**
 * 根据id获取一条评论
 */
exports.getOneComment = async function (id) {
  const result = await Comment.findOne({_id: id, isDelete: false})
  if(result) return result
  return null
}

/**
 * 检查name是否重复
 * @param {*} name 
 */
exports.checkName = async function (name) {
  const result = await Comment.findOne({name, isDelete: false})
  if(!result) return '昵称可用'
  return '昵称重复'
}

/**
 * 根据id获取所有子评论
 * @param {*} id 
 */
exports.getAllChildCmt = async function (id) {
  const result = await Comment.find({parentCmtId: id, isDelete: false})
  if(result.length !== 0) return result
  return null
}
