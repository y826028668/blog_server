const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../public/upload'))
  },
  filename: function (req, file, cb) {
    const timeStamp = Date.now()
    const randomStr = Math.random().toString(36).slice(-6)
    const ext = path.extname(file.originalname)
    const filename = `${timeStamp}-${randomStr}${ext}`
    cb(null, filename)
  }
})
const upload = multer({ 
  storage,
  limits: {
    fileSize: 200 * 1024
  },
  fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname)
    const whitlist = ['.jpg', '.gif', '.png', '.jpeg']
    if(whitlist.includes(extname)) {
      cb(null, true)
    } else {
      cb(new Error(`your ext name of ${extname} is not support`))
    }
  }
})

router.post('/', upload.single('img'), (req, res) => {
  console.log(req.body);
  // 文件存储路径
  const url = `/upload/${req.file.filename}`
  console.log(url);
  res.send({code: 0, msg: '', data: url})
})
module.exports = router
