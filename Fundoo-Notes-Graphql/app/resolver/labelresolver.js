const labelModel = require('../model/label.model')
const Apolloerror = require('apollo-server-errors')

const labelResolvers = {

    Query:{
        getLabel: async () => {
            const labels = await labelModel.find()
            return labels
        }
        
    },

    Mutation:{
        createLabel: async (_,{path},context) =>{
            const checkNote = await labelModel.findOne({noteId: path.noteID})

            if(checkNote){

                return new Apolloerror.UserInputError('note is already exist ')
                
            }
            const checkinglabel = await labelModel.findOne({labelName:path.labelname})

            if(checkinglabel){

                checkinglabel.noteId.push(path.noteID)

                await checkinglabel.save();
                return({

                    labelname:path.labelname,
                })
            }
            const labelmodel = new labelModel({

                userId: context.id,

                noteId: path.noteID,

                labelName:path.labelname,
                
            });

             
            await labelmodel.save();
            return ({
                labelName: path.labelName
            })
        },
    }
    
}
module.exports = labelResolvers;