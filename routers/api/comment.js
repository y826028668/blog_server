const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../getSendResult')
const comment = require('../../services/commentServices')

/* 获取所有评论 */
router.get(
  '/getAllComment',
  asyncHandler(async (req, res) => {
    const result = await comment.getAllComment()
    return result
  })
)

/* 根据文章id获取文章的所有一级评论 */
router.get(
  '/getPostAllComment',
  asyncHandler(async (req, res) => {
    const result = await comment.getPostAllComment(req.query.postId, req.query.pageNum, req.query.cmtNum)
    return result
  })
)

/* 获取最新的 num 条评论 */
router.get(
  '/getNewComment',
  asyncHandler(async (req, res) => {
    const result = await comment.getNewComment(req.query.num) || null
    return result
  })
)

/* 新增一个评论 */
router.post(
  '/addComment',
  asyncHandler(async (req, res) => {
    const result = await comment.addComment(req.body.parentId, req.body.name, req.body.email, req.body.content)
    return result
  })
)

/* 根据文章id，父评论id新增一个回复的评论 */
router.post(
  '/replyComment',
  asyncHandler(async (req, res) => {
    const result = await comment.replyComment(req.body.postId, req.body.parentCmtId, req.body.name, req.body.email, req.body.content)
    return  result
  })
)

/* 简单删除评论 */
router.delete(
  '/deleteComment',
  asyncHandler(async (req, res) => {
    const result = await comment.deleteComment(req.query.cmtId)
    if(result) return '删除成功'
  })
)

/* 恢复被简单删除的评论 */
router.put(
  '/undeleteComment',
  asyncHandler(async (req, res) => {
    const result = await comment.undeleteComment(req.body.cmtId)
    return result
  })
)

/* 彻底删除评论 */
router.delete(
  '/shiftDeleteComment',
  asyncHandler(async (req, res) => {
    const result = await comment.shiftDeleteComment(req.query.adminId, req.query.adminPwd, req.query.cmtId)
    if(result) return `删除评论成功`
  })
)

/* 获取被删除的评论 */
router.get(
  '/getDeleteComment',
  asyncHandler(async (req, res) => {
    const result = await comment.getDeleteComment()
    return result
  })
)

/* 根据id获取一条评论 */
router.get(
  '/getOneComment',
  asyncHandler(async (req, res) => {
    const result = await comment.getOneComment(req.query.id)
    return result
  })
)

/* 检查昵称是否重复 */
router.get(
  '/checkName',
  asyncHandler(async (req, res) => {
    const result = await comment.checkName(req.query.name)
    return result
  })
)

/* 根据id获取所有子评论 */
router.get(
  '/getAllChildCmt',
  asyncHandler(async (req, res) => {
    const result = await comment.getAllChildCmt(req.query.id)
    return result
  })
)

module.exports = router
