const { StatusCodes } = require('http-status-codes')
const User = require('../db_models/user')

const extractor = (req, res)=>{
    const {patientID}=req.body
    console.log(req.body)
    console.log(req.files)
    if (patientID){
       return res.status(200).json({status:'OK',message:'file uploaded successfully'})
    }
    else{
        return res.status(200).json({status:'error',message:'file not uploaded'})
    }
}
    module.exports={extractor}