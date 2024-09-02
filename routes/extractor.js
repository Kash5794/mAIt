const express = require('express')
const router = express.Router()


const {extractor}  = require('../controller/extractor')


router.post('/uploads',extractor)

module.exports = router