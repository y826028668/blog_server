const Post = require('../models/Post')
const Admin = require('../models/Admin')
const md5 = require('md5')
const { randomArr } = require('../util/getRandom')
const { getArrMostNumVal } = require('../util/getArrMost')

/* 获取所有文章 */
exports.getAllPost = async function () {
  const find = await Post.find({isDelete: false}, {title: 1, content: 1, time: 1}).sort({time: -1})
  const result = [...find]
  result.forEach(e => {
    e.content = e.content.slice(0, 30)
  })
  return result
}

/**
 * 分页获取文章
 * @param {*} pageNum 页码
 * @param {*} postNum 显示数量
 */
exports.getPagingPost = async function (pageNum = 1, postNum = 12) {
  let n = (pageNum - 1) * postNum
  const find = await Post.find({isDelete: false})
  .sort({time: -1})
  .skip(n)
  .limit(+postNum)
  const newData = [...find]
  newData.forEach(e => {
    e.content = e.content.slice(0, 100)
  })
  const total = await Post.find({isDelete: false}).countDocuments()
  if(total && find) {
    return {
      total,
      data: newData
    }
  }
  return null
}

/**
 * 根据文章分类分页获取文章
 * @param {*} type 类别
 * @param {*} pageNum 页码
 * @param {*} postNum 显示数量
 */
exports.getTypePost = async function (type = 'share', pageNum = 1, postNum = 12) {
  let n = (pageNum - 1) * postNum
  const find = await Post.find({parent: type, isDelete: false})
  .sort({time: -1})
  .skip(n)
  .limit(+postNum)
  const newData = [...find]
  newData.forEach(e => {
    e.content = e.content.slice(0, 100)
  })
  const total = await Post.find({isDelete: false}).countDocuments({parent: type})
  if(total && find) {
    return {
      total,
      data: newData
    }
  }
  return null
}

/**
 * 获取一篇文章
 * @param {*} postId 文章id
 */
exports.getOnePost = async function (postId) {
  if(!postId) return null
  let find = await Post.findOne({_id: postId, isDelete: false})
  let num = find.views + 1
  await Post.updateOne({_id: postId, isDelete: false}, {views: num}, {runValidators: true})
  find.content = JSON.stringify(find.content)
  return find
}

/**
 * 获取热门文章
 * @param {*} postNum 获取数量
 */
exports.getHotPost = async function (postNum = 5) {
  let find = await Post.find({isDelete: false},{
    title: 1,
    imgSrc: 1,
    author: 1,
    time: 1,
    tag: 1,
    views: 1,
    parent: 1
  }).sort({
    views: -1
  })
  const arr = find.slice(0, postNum) || null
  return arr
}

/**
 * 随机获取推荐文章
 * @param {*} postNum 获取数量
 */
exports.getRandomPost = async function (postNum = 5) {
  let find = await Post.find({isDelete: false},{
    title: 1,
    imgSrc: 1,
    author: 1,
    time: 1,
    tag: 1,
    parent: 1
  })
  // 从查找结果中随机抽postNum个数据组成新数组
  const arr = randomArr(find, postNum) || null
  return arr
}
/**
 * 添加一篇文章
 * 参数(postObj)包括title、parent、content、tag
 * @param {*} postObj 包括
 */
exports.addOnePost = async function (postObj) {
  if(postObj.title && postObj.parent && postObj.content && postObj.tag) {
    const addPost = await Post.create({...postObj})
    return {
      id: addPost._id,
      title: addPost.title,
      time: addPost.time
    }
  }
  return null
}

/**
 * 简单删除一篇文章
 * @param {*} postId 文章id
 */
exports.deletePost = async function (postId) {
  if(!postId) return null
  const result = await Post.updateOne({_id: postId, isDelete: false}, {isDelete: true}, {runValidators: true})
  if(result.nModified !== 0) return '删除文章成功'
  else return '删除文章失败'
}

/**
 * 修改一篇文章
 * 参数(postObj)包括postId、type|title|content|tag
 * @param {*} postObj 
 */
exports.updateOnePost = async function (postObj) {
  if(!postObj || !postObj.postId) return null
  const newPostObj = {...postObj}
  const postId = newPostObj.postId
  delete newPostObj.postId
  const result = await Post.updateOne({_id: postId}, newPostObj, {runValidators: true})
  if(result && result.nModified !== 0) return '文章修改成功'
  else return '文章修改失败'
}

/**
 * 恢复一篇被删除的文章
 * @param {*} postId 文章id
 */
exports.undeletePost = async function (postId) {
  if(!postId) return null
  const result = await Post.updateOne({_id: postId}, {isDelete: false}, {runValidators: true})
  if(result && result.nModified !== 0) return '文章恢复成功'
  else return '文章恢复失败'
}

/* 根据文章id彻底删除一篇文章 */
/**
 * 彻底删除一篇文章
 * 彻底删除为重要操作必须验证登录状态和管理员账号密码
 * @param {*} adminId 管理员账号
 * @param {*} adminPwd 管理员密码
 * @param {*} cmtId 评论id
 */
exports.shiftDeletePost = async function (adminId, adminPwd, postId) {
  if(!postId || !adminId || !adminPwd) return null
  adminPwd = md5(adminPwd)
  const adminIsRight = await Admin.findOne({adminId, adminPwd, isDelete: false})
  if(!adminIsRight) return null
  const result = await Post.deleteOne({_id: postId, isDelete: true})
  if(result.deletedCount !== 0) return '删除文章成功'
  else return '删除文章失败'
}

/**
 * 获取所有被删除的文章
 */
exports.getDeletePost = async function () {
  const find = await Post.find({isDelete: true}) || null
  return find
}

/**
 * 根据文章text搜索文章
 * @param {*} text
 */
exports.getSearchPost = async function (text, pageNum = 1, showNum = 12) {
  const find = await Post.find({ 
    $or: [
      {title: eval('/' + text + '/')},
      {tag: eval('/' + text + '/')}
    ],
    isDelete: false
  })
  .sort({time: -1})
  .skip((pageNum - 1) * showNum)
  .limit(+showNum)
  const total = await Post.find({ 
    $or: [
      {title: eval('/' + text + '/')},
      {tag: eval('/' + text + '/')}
    ],
    isDelete: false
  })
  .countDocuments()
  const arr = [...find]
  arr.forEach(e => {
    e.content = e.content.slice(0, 200)
  })
  if(arr.length !== 0) return {
    total,
    data: arr
  }
  else return '未找到搜索结果'
}

/**
 * 获取所有包含标签tag的文章
 * @param {*} tag
 */
exports.getTagPost = async function (tag, pageNum = 1, showNum = 12) {
  const find = await Post.find({
    $or: [
      {tag: eval('/' + tag + '/' + 'i')}
    ], 
    isDelete: false
  })
  .sort({time: -1})
  .skip((pageNum - 1) * showNum)
  .limit(+showNum)
  
  const total = await Post.find({
    $or: [
      {tag: eval('/' + tag + '/' + 'i')}
    ], 
    isDelete: false
  })
  .countDocuments()

  const arr = [...find]
  arr.forEach(e => {
    e.content = e.content.slice(0, 200)
  })
  if(arr.length !== 0) return {
    total,
    data: arr
  }
  else return '查找失败'
}

/**
 * 获取热门标签，数量为num个
 * @param {*} num
 */
exports.getHotTag = async function (num = 5) {
  const find = await Post.find({isDelete: false}, {
    tag: 1,
    _id: 0
  })
  const tags = []
  find.forEach(e => {
    tags.push(e.tag)
  })
  const aloneFind = getArrMostNumVal(tags, +num)
  return aloneFind
}

/**
 * 获取上一篇和下一篇文章
 * @param {*} postId 
 */
exports.getBrotherPost = async function (postId) {
  if(!postId) return null
  const find = await Post.find(
    {isDelete: false},
    {
      title: 1,
      parent: 1,
      time: 1
    }
  ).sort({time: -1})
  const arr = [...find]
  let curr = ''
  const result = {
    next: {
      _id: '',
      title: '',
      parent: ''
    },
    prev: {
      _id: '',
      title: '',
      parent: ''
    }
  }
  arr.forEach((e, i) => {
    if(e._id == postId) {
      curr = i
    }
  })
  if(curr === 0){
    result.next._id = arr[curr+1]._id
    result.next.title = arr[curr+1].title
    result.next.parent = arr[curr+1].parent
  } else if(curr === arr.length) {
    result.prev._id = arr[curr-1]._id
    result.prev.title = arr[curr-1].title
    result.prev.parent = arr[curr-1].parent
  } else {
    result.prev._id = arr[curr-1]._id
    result.prev.title = arr[curr-1].title
    result.prev.parent = arr[curr-1].parent

    result.next._id = arr[curr+1]._id
    result.next.title = arr[curr+1].title
    result.next.parent = arr[curr+1].parent
  }
  return result
}
