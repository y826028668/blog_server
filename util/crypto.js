// 128位秘钥
const secret = Buffer.from("vmcitwcq9skz6pmn")
const crypto = require('crypto')
const iv = Buffer.from("i8f8x49fzico9ywb")

/* 加密一个字符串 */
exports.encrypt = function (str) {
  const cry = crypto.createCipheriv('aes-128-cbc', secret, iv)
  let result = cry.update(str, 'utf-8', 'hex')
  result += cry.final('hex')
  return result
}

/* 解密一个字符串 */
exports.decrypt = function (str) {
  const dec = crypto.createDecipheriv('aes-128-cbc', secret, iv)
  let result = dec.update(str, 'hex', 'utf-8')
  result += dec.final('utf-8')
  return result
}
