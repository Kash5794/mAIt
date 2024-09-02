const express = require('express')
const router = express.Router()

const {login,signup,findUser,extractor,fetchPatientNote,page}  = require('../controller/auth')

//const {extractor}  = require('../controller/extractor')


router.post('/upload',extractor)
router.post('/signup',signup)
router.get('/',page)
router.get('/register',page)

//router.get('/dashboard',page)
router.post('/login',login)
router.get('/findUser',findUser)
router.get('/findPatient',fetchPatientNote)


module.exports = router