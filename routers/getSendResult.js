/* 封装响应数据格式 */
exports.getErr = function (errCode = 500, err = 'server internal error') {
  return {
    code: errCode,
    msg: err
  }
}

exports.getResult = function (res) {
  return {
    code: 200,
    msg: 'OK',
    data: res
  }
}

exports.asyncHandler = (handler) => {
  return async (req, res, next) => {
    try{
      const result = await handler(req, res, next)
      res.send(exports.getResult(result))
    } catch (err) {
      next(err)
    }
  }
}
