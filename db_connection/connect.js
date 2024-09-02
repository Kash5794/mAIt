const mongoose = require('mongoose')

/**
 *useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
 * 
 */

const connectDB = (url) => {
  return mongoose.connect(url, {
    
  })
}
module.exports = connectDB