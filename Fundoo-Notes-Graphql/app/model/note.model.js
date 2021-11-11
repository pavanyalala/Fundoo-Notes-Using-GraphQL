const mongoose = require('mongoose')
const NoteSchema = new mongoose.Schema({
   
    email:{
      type: String,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
   
    
    
})
module.exports = mongoose.model('Notes',NoteSchema);