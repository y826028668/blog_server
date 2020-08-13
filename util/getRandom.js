/* 在一个数组中随机取n个值返回新数组 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
exports.randomArr = function (arr, n) {
  const newArr = []
  if(!arr) return
  for (let i = 0; i < n; i++) {
    newArr.push(arr[getRandom(0, arr.length)])
  }
  return newArr
}
exports.randomOne = function (arr) {
  if(arr.length === 0) return null
  return getRandom(0, arr.length)
}
