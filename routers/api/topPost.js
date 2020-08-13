const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../getSendResult')
const topPost = require('../../services/topPostServices')

/* 获取置顶文章 */
router.get(
  '/getTopPost',
  asyncHandler(async (req, res) => {
    const result = await topPost.getTopPost()
    return result
  })
)

/* 取消一篇文章的置顶 */
router.delete(
  '/cancelTopPost',
  asyncHandler(async (req, res) => {
    const result = await topPost.cancelTopPost(req.query.id)
    return result
  })
)

/* 设置一篇文章为置顶文章 */
router.post(
  '/addTopPost',
  asyncHandler(async (req, res) => {
    const result = await topPost.addTopPost(req.body.postId)
    return result
  })
)

module.exports = router
