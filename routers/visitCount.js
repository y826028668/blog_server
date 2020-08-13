/* 站点访问数量统计 */
const express = require('express')
const router = express.Router()
const moment = require('moment')
const { asyncHandler } = require('./getSendResult')
const visitCount = require('../models/visitCount')

router.get(
  '/api/visit', 
  asyncHandler(async (req, res) => {
    if(req.query.userIp && req.query.location) {
      let dateNow = Date.now()
      const find = await visitCount.findOne({userIp: req.query.userIp})
      if(find !== null) {
        const findTime = +moment(find.time)
        if(dateNow - findTime > 300000){
          let count = find.count + 1
          await visitCount.updateOne({userIp: req.query.userIp}, {count, time: dateNow}, {runValidators: true})
          return 'null'
        }
      } else {
        await visitCount.create({userIp: req.query.userIp, location: req.query.location}, {runValidators: true})
        return 'null'
      }
    }
  })
)

router.get(
  '/api/getWebCount',
  asyncHandler(async (req, res) => {
    const find = await visitCount.find({isDelete: false})
    let result = 0
    find.forEach(e => {
      result += e.count
    })
    return result
  })
)
module.exports = router
