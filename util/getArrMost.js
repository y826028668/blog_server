/**
 * 对数组中值的出现次数进行统计
 * 返回一个数组，该数组长度为num
 * 从高到低进行排序，依次是出现次数最多的
 * @param {*} arr 
 * @param {*} num 
 */
exports.getArrMostNumVal = function (arr, num) {
  if (!arr || !num) return null
  if (Array.isArray(arr) && typeof (num) === 'number') {
    const aloneArr = [...new Set(arr)]
    const newAloneArr = aloneArr.map(a => {
      return {
        tag: a
      }
    })
    newAloneArr.forEach(item => {
      arr.forEach(e => {
        if(item.tag === e) {
          if(!item.count) {
            item.count = 1
          } else {
            item.count += 1
          }
        }
      })
    })
    newAloneArr.sort((a, b) => {
      return b.count - a.count
    })
    return newAloneArr.splice(0, num)
  } else {
    return null
  }
}
