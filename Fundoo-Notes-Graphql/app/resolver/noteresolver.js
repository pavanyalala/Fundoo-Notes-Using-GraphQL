const userModel = require('../model/user.model')
const noteModel = require('../model/note.model')
const labelModel = require('../model/label.model')

const noteresolvers = {

    Query : {

        getAllNotes: async ()=>{
           return await noteModel.find()
        },  

        getNotes: async(_,{id})=>{
           return await noteModel.findById(id);
        }
    },

    Mutation : {

        createNote: async(_,{post},context)=>{

            const existingUser = await userModel.findOne({ email: context.email }); 
            const notes =  new noteModel({

                title : post.title,
                description : post.description,
                emailid : post.email,
            })
            if(existingUser){
                return 'user id already exist'
            }
            await notes.save();
            return notes
        }, 

        editNote: async(_,args)=>{

            const {id} =args

           const {title, description} =args.post

           const note = await noteModel.findByIdAndUpdate(id,{title,description},{new :true})

           return note
        },

        deleteNote: async(_,args)=>{

            const { id } = args
    
            await noteModel.findByIdAndDelete(id)
    
            return 'notes deleted successfully'
    
        },

        saveLabelToNote: async (_,params) =>{
            //find labelID from noteModel Schema
        let id = await noteModel.find({ labelID: params.label_ID })

        //if id is already present
        if (id.length > 0) {
            return { message: "This label is not present in notes" }
        }

        //find id from noteModel and update(push) into notes
        let note = await noteModel.findOneAndUpdate({ _id: params.noteID },
            {
                $push: {
                    labelID: params.label_ID
                }

            })
            if (!note) {
                return { message: "label not added " }
            } else {
                return { message: "label added on note successfully " }
            }
        }


     }
}

module.exports = noteresolvers;