const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../getSendResult')
const mood = require('../../services/moodServices')

/* 获取所有心情 */
router.get(
  '/getAllMood',
  asyncHandler(async (req, res) => {
    const result = await mood.getAllMood()
    return result
  })
)

/* 获取最新的一条心情 */
router.get(
  '/getNewMood',
  asyncHandler(async (req, res) => {
    const result = await mood.getNewMood()
    return result
  })
)

/* 获取随机一条心情 */
router.get(
  '/getRandomMood',
  asyncHandler(async (req, res) => {
    const result = await mood.getRandomMood()
    return result
  })
)

/* 添加一条心情 */
router.post(
  '/addMood',
  asyncHandler(async (req, res) => {
    const result = await mood.addMood(req.body.content)
    if(result) return '添加心情成功'
  })
)

/* 修改一条心情 */
router.put(
  '/updateMood',
  asyncHandler(async (req, res) => {
    const result = await mood.updateMood(req.body.moodId, req.body.newContent)
    if(result) return `修改成功，内容修改为: '${req.body.newContent}'` 
  })
)

/* 简单删除一条心情 */
router.delete(
  '/deleteMood',
  asyncHandler(async (req, res) => {
    const result = await mood.deleteMood(req.query.moodId)
    if(result) return '删除心情成功'
  })
)

/* 恢复一条简单删除的心情 */
router.put(
  '/undeleteMood',
  asyncHandler(async (req, res) => {
    const result = await mood.undeleteMood(req.body.moodId)
    return result
  })
)

/* 彻底删除一条心情 */
router.delete(
  '/shiftDeleteMood',
  asyncHandler(async (req, res) => {
    const result = await mood.shiftDeleteMood(req.query.adminId, req.query.adminPwd, req.query.moodId)
    return result
  })
)

/* 获取所有被删除的心情 */
router.get(
  '/getDeleteMood',
  asyncHandler(async (req, res) => {
    const result = await mood.getDeleteMood()
    if(result.length === 0) return '没有删除心情'
    return result
  })
)

module.exports = router
