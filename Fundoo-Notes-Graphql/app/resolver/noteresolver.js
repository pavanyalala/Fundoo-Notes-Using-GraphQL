const userModel = require('../model/user.model')
const noteModel = require('../model/note.model')

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
    
        }

    }
}

module.exports = noteresolvers;