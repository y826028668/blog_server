const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../getSendResult')
const dataNum = require('../../services/dataNumService')

router.get(
  '/api/num',
  asyncHandler(async (req, res) => {
    const result = await dataNum.getDataNum()
    return result
  })
)

module.exports = router
