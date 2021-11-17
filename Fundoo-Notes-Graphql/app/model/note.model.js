const mongoose = require('mongoose')
const NoteSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: [true, 'title required'],
    },
    description: {
        type: String,
        required: [true, 'description required'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    labelID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labelModel'
    }]
},
    {
        timestamps : true
    
});
module.exports = mongoose.model('Notes',NoteSchema);