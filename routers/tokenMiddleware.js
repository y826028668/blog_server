/* 解析token */
const { getErr } = require('./getSendResult')
const { pathToRegexp } = require('path-to-regexp');
const { getLogger } = require('log4js');
// const crypto = require('../util/crypto')
// 对需要登录验证api进行过滤
const needTokenApi = [
  {method: 'DELETE'},
  {method: 'PUT'},
  {method: 'POST'}
]

module.exports = (req, res, next) => {
  let apis = []
  if(req.path === '/api/comment/addComment' || req.path === '/api/comment/replyComment' || req.path === '/api/msg/addMsg') {
    next()
    return
  }
  // 对除登录外的所有post、put、delete api进行过滤
  if(req.path === '/api/admin/login') {
    next()
    return
  } else {
    apis = needTokenApi.filter(api => {
      return api.method === req.method
    })
    if(apis.length === 0) {
      next()
      return
    }
  }

  // 获取token
  // let token = req.cookies.token 
  // if(!token) token = req.header.authorization
  // const adminId = crypto.decrypt(token)
  // req.adminId = adminId
  // 验证token
  if (req.session.adminId) {
    next()
  } else {
    handleNonToken(req, res, next)
  }
}

function handleNonToken(req, res, next) {
  res.status(403).send(getErr(403, 'You have no token, security authentication fails'))
}
