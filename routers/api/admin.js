const express = require('express')
const router = express.Router()
const adminServ = require('../../services/adminService')
const { asyncHandler } = require('../getSendResult')
const crypto = require('../../util/crypto')

/**
 * 添加管理员
 * 暂时不开放该接口
 */
// router.post(
//   '/addAdmin',
//   asyncHandler(async (req, res) => {
//     const result = await adminServ.addAdmin(req.body)
//     if(result) return {
//       isOk: 'OK',
//       msg: `添加管理员成功，请牢记账号${result.adminId}`
//     }
//     return {
//       code: 404,
//       msg: '添加管理员失败'
//     }
//   })
// )

/* 登录 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const result = await adminServ.login(req.body.adminId, req.body.adminPwd)
    if(result) {
      let value = result
      // 加密
      value = crypto.encrypt(value.toString())
      req.session.adminId = value
      // res.cookie('token', value, {
      //   path: '/',
      //   maxAge: 60000 * 60 * 12,
      //   httpOnly: true
      // })
      // res.header('authorization', value)
      return {
        value,
        msg: '登录成功'
      }
    }
    return '登录失败'
  })
)

/* 注销 */
router.get(
  '/logout',
  asyncHandler(async (req, res) => {
    const result = await adminServ.logout(req)
    return result
  })
)

/* 验证 */
router.get(
  '/verify',
  asyncHandler(async (req, res) => {
    if (!req.query.token) return null
    const result = await adminServ.verify(req.query.token)
    return result
  })
)

/* 修改密码 */
router.put(
  '/change',
  asyncHandler(async (req, res) => {
    const result = await adminServ.updataAdmin(req.body.adminId, req.body.adminPwd, req.body.newPwd)
    return result
  })
)

module.exports = router
