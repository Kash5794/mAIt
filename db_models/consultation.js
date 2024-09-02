const mongoose = require('mongoose')

const consultation = new mongoose.Schema(
  {
    id: {
        type:String,
        required: [true, 'Please provide'],
    },
    condition: {
        type:String,
        required: [true, 'Please provide'],
    },
    followUp: {
      type: String,
      required: [true, 'Please provide'],
     
    },
    summary: {
        type: String,
        required: [true, 'Please provide'],
       
      },
    addedBy: {
        type:String,
        required: [true, 'Please provide'],
    }
    
  },
  {timestamps:true}
)

module.exports = mongoose.model('Consultation', consultation)