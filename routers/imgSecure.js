const url = require('url')
const path = require('path')

module.exports = (req, res, next) => {
  const host = req.headers.host // 获取本站的主机名、端口号
  let referer = req.headers.referer // 图片展示的网页的主机名、端口号
  const extname = path.extname(req.path)
  if(!['.jpg', '.jpeg', '.png', '.git'].includes(extname)){
    next()
    return
  }
  if(referer) {
    referer = url.parse(referer).host
  }
  if(referer && host !== referer) {
    req.url = '/img/funny.jpg'
  }
  next()
}
