const express = require('express')
const app = express()
const path = require('path')
const history = require('connect-history-api-fallback')
const staticRoot = path.resolve(__dirname, '../public')
const session = require('express-session')
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const cors = require('cors')
const port = 1234
const xss = require('xss')

app.use(history())
/* 图片防盗链 */
app.use(require('./imgSecure'))

/* session */
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'b7nf5q7hrnex6g1p',
  name: 'sessionid'
}))

/* 映射静态资源 */
app.use(express.static(staticRoot))

/* 跨域中间件 */
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))

/* cookie操作 */
// app.use(cookieParser())

/* 解析token */
app.use(require('./tokenMiddleware'))

/* 解析json参数 */
app.use(express.json({limit: '5mb'}))

/* 解析请求体内容 */
app.use(express.urlencoded({extended: true}))

/* xss防御 */
app.use((req, res, next) => {
  for (const key in req.body) {
    const val = req.body[key]
    req.body[key] = xss(val)
  }
  next()
})

/* api日志记录 */
app.use(require('./apiLogger'))

/* 处理api请求 */
/* 管理员相关请求处理 */
app.use('/api/admin', require('./api/admin'))
/* 文件上传 */
// app.use('/api/upload', require('./api/upload'))
/* 文章相关请求处理 */
app.use('/api/post', require('./api/post'))
/* 评论相关请求处理 */
app.use('/api/comment', require('./api/comment'))
/* 留言相关请求处理 */
app.use('/api/msg', require('./api/msg'))
/* 心情短语相关请求处理 */
app.use('/api/mood', require('./api/mood'))
/* 置顶文章相关请求处理 */
app.use('/api/topPost', require('./api/topPost'))
/* 获取各分类数据的数量 */
app.use(require('./api/dataNum'))

/* 访问统计 */
app.use(require('./visitCount'))

/* 错误处理 */
app.use(require('./errorMiddleware'))

app.listen(port, () => {
  console.log('监听端口1234');
})
