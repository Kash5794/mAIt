const express = require('express');
require("dotenv").config();



const app = express();
const path = require('path')
const fileUpload = require('express-fileupload')
const upload = require('./middleware/multer')
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")


app.use(express.json());
app.use(express.static(path.join(__dirname,'build')))
app.use(express.static('public'))
app.use(helmet()) //protecting server response header information in order to hide the technology from attackers
app.use(cors()) //cross origin resource sharing is prohibited by this middleware
app.use(xss()) //protect the server header response against cross-site scripting attack

app.use(express.urlencoded({ extended: false }))
const connectDB = require('./db_connection/connect');

const authRouter = require('./routes/auth');
//const extractorRouter = require('./routes/extractor');


app.use(upload,authRouter)

//app.use(extractorRouter)

const port = process.env.PORT || 3000;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI).then(()=>console.log('database connected succesfully'));
      
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();