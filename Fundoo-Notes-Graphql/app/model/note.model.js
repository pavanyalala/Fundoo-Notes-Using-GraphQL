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
        ref: 'userModel',
        required: [true, 'User id required'],
    },
    labelID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labelModel',
        required: [true, 'Label  id required'],
    }]
},
    {
        timestamps : true
    
});
module.exports = mongoose.model('Note',NoteSchema);