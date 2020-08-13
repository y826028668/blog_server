const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../getSendResult')
const post = require('../../services/postServices')

/* 获取所有文章 */
router.get(
  '/getAllPost',
  asyncHandler(async (req, res) => {
    const result = await post.getAllPost()
    return result
  })
)

/* 分页获取文章 */
router.get(
  '/getPagingPost',
  asyncHandler(async (req, res) => {
    const result = await post.getPagingPost(req.query.pageNum, req.query.postNum)
    return result
  })
)

/* 根据类别获取文章 */
router.get(
  '/getTypePost',
  asyncHandler(async (req, res) => {
    const result = await post.getTypePost(req.query.type, req.query.pageNum, req.query.postNum)
    return result
  })
)

/* 根据文章id获取一篇文章 */
router.get(
  '/getOnePost',
  asyncHandler(async (req, res) => {
    const result = await post.getOnePost(req.query.postId)
    return result
  })
)

/* 获取热门文章 */
router.get(
  '/getHotPost',
  asyncHandler(async (req, res) => {
    const result = await post.getHotPost(req.query.postNum)
    return result
  })
)

/* 获取推荐文章 */
router.get(
  '/getRandomPost',
  asyncHandler(async (req, res) => {
    const result = await post.getHotPost(req.query.postNum)
    return result
  })
)

/* 增加一篇文章 */
router.post(
  '/addOnePost',
  asyncHandler(async (req, res) => {
    const result = await post.addOnePost(req.body)
    return result
  })
)

/* 根据文章id简单删除一篇文章 */
router.delete(
  '/deletePost',
  asyncHandler(async (req, res) => {
    const result = await post.deletePost(req.query.postId)
    return result
  })
)

/* 根据文章id修改一篇文章 */
router.put(
  '/updateOnePost',
  asyncHandler(async (req, res) => {
    const result = await post.updateOnePost(req.body)
    return result
  })
)

/* 根据文章id恢复已被简单删除的一篇文章 */
router.put(
  '/undeletePost',
  asyncHandler(async (req, res) => {
    const result = await post.undeletePost(req.body.postId)
    return result
  })
)

/* 根据文章id彻底删除一篇文章 */
router.delete(
  '/shiftDeletePost',
  asyncHandler(async (req, res) => {
    const result = await post.shiftDeletePost(req.query.adminId, req.query.adminPwd, req.query.postId)
    return result
  })
)

/* 获取所有被删除的文章 */
router.get(
  '/getDeletePost',
  asyncHandler(async (req, res) => {
    const result = await post.getDeletePost()
    return result
  })
)

/* 获取搜索的文章 */
router.get(
  '/getSearchPost',
  asyncHandler(async (req, res) => {
    const result = await post.getSearchPost(req.query.text, req.query.pageNum, req.query.showNum)
    return result
  })
)

/* 获取包含tag的文章 */
router.get(
  '/getTagPost',
  asyncHandler(async (req, res) => {
    const result = await post.getTagPost(req.query.tag, req.query.pageNum, req.query.showNum)
    return result
  })
)

/* 获取热门标签num个 */
router.get(
  '/getHotTag',
  asyncHandler(async (req, res) => {
    const result = await post.getHotTag(req.query.num)
    return result
  })
)

/* 根据id获取上一篇和下一篇文章 */
router.get(
  '/getBrotherPost',
  asyncHandler(async (req, res) => {
    const result = await post.getBrotherPost(req.query.postId)
    return result
  })
)
module.exports = router
