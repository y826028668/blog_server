const TopPost = require('../models/TopPost')
const Post = require('../models/Post')

/**
 * 获取置顶文章
 */
exports.getTopPost = async function () {
  const find = await TopPost.find({}).sort({time: -1})
  let result = []
  if(find.length > 4) {
    result = find.slice(0, 4)
    return result
  }
  return find
}

/**
 * 根据置顶id取消该文章的置顶
 * @param {*} topPostId 推荐文章id
 */
exports.cancelTopPost = async function (id) {
  if(!id) return null
  const result = await TopPost.deleteOne({_id: id}, {runValidators: true})
  if(result.deletedCount !== 0) return '取消置顶成功'
  else return '取消置顶失败'
}

/**
 * 根据文章id将其设置为置顶文章
 * @param {*} postId 设置文章的文章id
 */
exports.addTopPost = async function (postId) {
  if(!postId) return null
  const findTopPost = await TopPost.find({postId})
  if(findTopPost.length === 0) {
    const findPost = await Post.findOne({_id: postId, isDelete: false})
    if(!findPost) return null
    const result = await TopPost.create({postId, parent: findPost.parent, title: findPost.title, author: findPost.author, tag: findPost.tag, imgSrc: findPost.imgSrc})
    return result
  } else {
    return '该文章已置顶'
  }
}
