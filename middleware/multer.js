const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        
        cb(null,"allFiles/upload")
    },
    filename:(req,file,cb)=>{
        
        cb(null,req.patientID + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage
})

module.exports=upload.single('file')