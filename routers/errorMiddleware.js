const getMsg = require('./getSendResult')
const multer = require('multer')

module.exports = (err, req, res, next) => {
  if(err) {
    if(err instanceof multer.MulterError) {
      res.status(413).send(getMsg.getErr(err.message, 413))
    }
    const errObj = {
      code: 500,
      msg: err instanceof Error ? err.message : err
    }
    res.status(500).send(getMsg.getErr(500, errObj.msg))
  }
}
