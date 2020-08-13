const md5 = require('md5')
const Admin = require('../models/Admin')
const crypto = require('../util/crypto')

/**
 * 添加一个管理员
 * adminObj对象保函账号(adminId)和密码(adminPwd)
 * @param {Object} adminObj
 */
// exports.addAdmin = async function (adminObj) {
//   if(!adminObj || !adminObj.adminId || !adminObj.adminPwd) return null
//   const find = await Admin.findOne({adminId: adminObj.adminId, idDelete: false})
//   if (!find) {
//     adminObj.adminPwd = md5(adminObj.adminPwd)
//     const res = await Admin.create({...adminObj})
//     return res
//   }
//   return null
// }

/**
 * 验证账号密码成功后，修改密码
 * @param {*} adminId
 * @param {*} adminPwd
 * @param {*} newPwd
 */
exports.updataAdmin = async function (adminId, adminPwd, newPwd) {
  if(!adminId || !adminPwd || !newPwd) return null
  const find = await Admin.findOne({adminId, isDelete: false})
  newPwd = md5(newPwd)
  adminPwd = md5(adminPwd)
  if(find && find.adminId === adminId && find.adminPwd === adminPwd) {
    const res = await Admin.updateOne({adminId}, {adminPwd: newPwd}, {runValidators: true})
    if(res.nModified !== 0) return '修改密码成功'
    else return '修改密码失败, 原账号、密码有误，或新密码于原密码相同'
  }
  return '修改失败，请检查账号密码是否填写正确'
}

/**
 * 管理员登录
 * @param {*} id
 * @param {*} pwd
 */
exports.login = async function (adminId, adminPwd) {
  if(!adminId || !adminPwd) return null
  adminPwd = md5(adminPwd)
  const res = await Admin.findOne({adminId, isDelete: false})
  if(res && res.adminId === adminId && res.adminPwd === adminPwd) {
    return res.adminId
  } else {
    return null
  }
}

/**
 * 注销登录
 */
exports.logout = async function (req) {
  if(req.session.adminId) {
    req.session.destroy()
    return '注销登录成功'
  }
  return '未登陆'
}

/**
 * 验证
 */
exports.verify = async function (token) {
  let result = crypto.encrypt(token.toString())
  return result
}


