const userModel = require('../model/user.model')
const noteModel = require('../model/note.model')
const labelModel = require('../model/label.model')
const { listeners } = require('../model/note.model')
const ApolloError = require('apollo-server-errors');
const checkAuth = require('../utilities/auth')

const noteresolvers = {

    Query : {

        getAllNotes: async (_,{ },context)=>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }
           return await noteModel.find()
        },  

        getNotes: async(_,{id},context)=>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }
            
           return await noteModel.findById(id);
        }
    },

    Mutation : {

        createNote: async(_,{post},context)=>{

            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }

            const existingUser = await userModel.findOne({ email: post.email }); 
            const notes =  new noteModel({

                title : post.title,
                description : post.description,
                userId: context.id,
                
            })
            if(existingUser){
                return 'user id already exist'
            }
            await notes.save();
            return notes
        }, 

        editNote: async(_,args,context)=>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');
            }

            const {id} =args

           const {title, description} =args.post

           const note = await noteModel.findByIdAndUpdate(id,{title,description},{new :true})

           return note
        },

        deleteNote: async(_,args,context)=>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }

            const { id } = args
    
            await noteModel.findByIdAndDelete(id)
    
            return 'notes deleted successfully'
    
        },

        saveLabelToNote: async (_,params,context) =>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }
            //find labelID from noteModel Schema
        let id = await noteModel.find({ labelID: params.label_ID })
        //if id is already present
        if (!id.length > 0) {
            
            return { message: "This label is  present in notes" }
        }
       

        //find id from noteModel and update(push) into notes
        let note = await noteModel.findOneAndUpdate({ _id: params.noteID },
            {
                $addToSet: {
                    labelID: params.label_ID
                }

            })
            if (!note) {
                return { message: "label not added " }
            } else {
                return { message: "label added on note successfully " }
            }
        },
        deleteLabelToNote: async (_,params,context) =>{

            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }
            //find labelID from noteModel Schema
        let id = await noteModel.find({ labelID: params.label_ID })

        if (!id.length > 0) {
            return { message: "This label is not present in notes" }
        }
        let note = await noteModel.findOneAndUpdate({ _id: params.noteID },
            {
                $pull: {
                    labelID: params.label_ID
                }

            })

            return { message: "label delete from note successfully " }
        }


     }
}

module.exports = noteresolvers;