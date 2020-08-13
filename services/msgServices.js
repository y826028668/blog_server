const md5 = require('md5')
const Msg = require('../models/Msg')
const Admin = require('../models/Admin')


/**
 * 获取所有留言
 */
exports.getAllMsg = async function () {
  const find = await Msg.find({isDelete: false}).sort({time: -1})
  return find
}

/**
 * 分页获取留言
 * @param {*} pageNum 页码
 * @param {*} msgShowNum 显示数量
 */
exports.getPagingMsg = async function (pageNum = 1, msgShowNum = 6) {
  let n = (pageNum - 1) * msgShowNum
  const find = await Msg.find({isDelete: false})
  .sort({time: -1})
  .skip(n)
  .limit(+msgShowNum) || null
  const total = await Msg.find({isDelete: false}).countDocuments()
  return {
    total,
    data: find
  }
}

/* 添加留言 */
/**
 * 添加一条留言
 * 参数(msgObj)包括name、email、content
 * @param {*} msgObj 
 */
exports.addMsg = async function (name, email, content) {
  if(!name || !email || !content) return null
  const find = await Msg.find({name})
  if(find.length === 0) {
    const result = await Msg.create({name, email, content})
    if(result._id) return '留言成功'
    return '留言失败'
  }
  return '昵称重复'
}

/**
 * 根据id回复留言，仅管理员有此权限
 * @param {*} msgId 留言id
 * @param {*} content 回复内容
 */
exports.replyMsg = async function (msgId, content) {
  if(!msgId || !content) return null
  const result = await Msg.updateOne({_id: msgId, isDelete: false},{replyMsg: content}, {runValidators: true})
  if(result.nModified === 1) return '回复成功'
  else return '回复失败'
}

/**
 * 删除管理员的回复内容
 * @param {*} msgId 留言id
 */
exports.deleteAdminMsg = async function (msgId) {
  if(!msgId) return null
  const findMsg = await Msg.findOne({_id: msgId})
  if(findMsg.replyMsg && findMsg.replyMsg.content) {
    const result = await Msg.updateOne({_id: msgId, isDelete: false},{replyMsg: {content: '', name: '', time: ''}}, {runValidators: true})
    if(result.nModified === 1) return '删除回复成功'
    else return '删除回复失败'
  } else {
    return '未找到评论下的回复，删除失败，请检查后重试'
  }
  
}

/**
 * 简单删除一条留言
 * @param {*} msgId 留言id
 */
exports.deleteMsg = async function (msgId) {
  if(!msgId) return null
  const result = await Msg.updateOne({_id: msgId, isDelete: false}, {isDelete: true}, {runValidators: true})
  if(result && result.nModified !== 0) {
    return '删除成功'
  } else {
    return '删除失败'
  }
}

/* 根据id */
/**
 * 恢复一条简单删除的留言
 * @param {*} msgId 留言id
 */
exports.undeleteMsg = async function (msgId) {
  if(!msgId) return null
  const result = await Msg.updateOne({_id: msgId, isDelete: true}, {isDelete: false} ,{runValidators: true})
  if(result && result.nModified === 1) return '恢复成功'
  else return '恢复失败'
}

/**
 * 彻底删除一条留言
 * 彻底删除为重要操作必须验证登录状态和管理员账号密码
 * @param {*} adminId 管理员账号
 * @param {*} adminPwd 管理员密码
 * @param {*} msgId 评论id
 */
exports.shiftDeleteMsg = async function (adminId, adminPwd, msgId) {
  if(!adminId || !adminPwd || !msgId) return null
  adminPwd = md5(adminPwd)
  const adminIsRight = await Admin.findOne({adminId, adminPwd, isDelete: false})
  if(adminIsRight) {
    const result = await Msg.deleteOne({_id: msgId, isDelete: true})
    if(result && result.deletedCount !== 0) return '删除留言成功'
    else return '删除留言失败'
  }
  return null
}

/**
 * 获取所有被删除的留言
 */
exports.getDeleteMsg = async function () {
  const result = await Msg.find({isDelete: true})
  return result
}

/**
 * 检查昵称是否重复
 */
exports.checkName = async function (name) {
  if(!name) return null
  const result = await Msg.find({name, isDelete: false})
  if(result.length !== 0) return '昵称重复'
  return '昵称可用'
}
