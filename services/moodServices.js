const Mood = require('../models/Mood')
const Admin = require('../models/Admin')
const { randomOne } = require('../util/getRandom')

/**
 * 获取所有心情
 */
exports.getAllMood = async function () {
  const result = await Mood.find({isDelete: false}).sort({time: -1})
  return result
}

/**
 * 获取一条最新的心情
 */
exports.getNewMood = async function () {
  const result = await Mood.find({isDelete: false}).sort({time: -1}).limit(1)
  return result
}

/**
 * 随机获取一条心情
 */
exports.getRandomMood = async function () {
  const findMood = await Mood.find({isDelete: false})
  let result = findMood[randomOne(findMood)]
  return result
}

/**
 * 添加一条心情
 * @param {*} content 心情内容
 */
exports.addMood = async function (content) {
  if(!content) return null
  const result = await Mood.create({content})
  return result
}

/**
 * 修改一条心情
 * @param {*} moodId 心情数据id
 * @param {*} newContent 修改内容
 */
exports.updateMood = async function (moodId, newContent) {
  if(!moodId || !newContent) return null
  const result = await Mood.updateOne({_id: moodId, isDelete: false}, {content: newContent}, {runValidators: true})
  return result
}

/**
 * 简单删除一条心情
 * @param {*} moodId 心情id
 */
exports.deleteMood = async function (moodId) {
  if(!moodId) return null
  const result = await Mood.updateOne({_id: moodId, isDelete: false}, {isDelete: true}, {runValidators: true})
  return result
}

/**
 * 恢复一条简单删除的心情
 * @param {*} moodId 心情id
 */
exports.undeleteMood = async function (moodId) {
  if(!moodId) return null
  const result = await Mood.updateOne({_id: moodId, isDelete: true}, {isDelete: false}, {runValidators: true})
  if(result && result.nModified === 1) return '恢复成功'
  else return '恢复失败'
}

/**
 * 彻底删除一条心情
 * 彻底删除为重要操作必须验证登录状态和管理员账号密码
 * @param {*} adminId 管理员账号
 * @param {*} adminPwd 管理员密码
 * @param {*} moodId 心情id
 */
exports.shiftDeleteMood = async function (adminId, adminPwd, moodId) {
  if(!adminId || !adminPwd || !moodId) return null
  const adminIsRight = Admin.findOne({adminId, adminPwd, isDelete: false})
  if(adminIsRight) {
    const result = await Mood.deleteOne({_id: moodId, isDelete: true})
    if(result.n === 0 && result.deletedCount === 0) return '彻底删除心情失败'
    else return '删除心情成功'
  }
}

/**
 * 获取所有被删除的心情
 */
exports.getDeleteMood = async function () {
  const result = await Mood.find({isDelete: true})
  return result
}

