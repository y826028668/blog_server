const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../getSendResult')
const msg = require('../../services/msgServices')

/* 获取所有留言 */
router.get(
  '/getAllMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.getAllMsg()
    return result
  })
)

/* 分页获取留言 */
router.get(
  '/getPagingMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.getPagingMsg(req.query.pageNum, req.query.msgShowNum)
    return result
  })
)

/* 添加留言 */
router.post(
  '/addMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.addMsg(req.body.name, req.body.email, req.body.content)
    return result
  })
)

/* 根据id回复留言，仅管理员 */
router.post(
  '/replyMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.replyMsg(req.body.msgId, req.body.content)
    return result
  })
)

/* 根据id删除管理员的回复 */
router.delete(
  '/deleteAdminMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.deleteAdminMsg(req.query.msgId)
    return result
  })
)

/* 根据id简单删除一条留言 */
router.delete(
  '/deleteMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.deleteMsg(req.query.msgId)
    return result
  })
)

/* 根据id恢复简单删除的留言 */
router.put(
  '/undeleteMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.undeleteMsg(req.body.msgId)
    return result
  })
)

/* 根据登录状态、管理员认证、留言id彻底删除一条留言 */
router.delete(
  '/shiftDeleteMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.shiftDeleteMsg(req.query.adminId, req.query.adminPwd, req.query.msgId)
    return result
  })
)

/* 获取所有被删除的留言 */
router.get(
  '/getDeleteMsg',
  asyncHandler(async (req, res) => {
    const result = await msg.getDeleteMsg()
    if(result.length === 0) return '并没有删除任何留言'
    else return result
  })
)


/* 检查昵称是否重复 */
router.get(
  '/checkName',
  asyncHandler(async (req, res) => {
    const result = await msg.checkName(req.query.name)
    return result
  })
)
module.exports = router
