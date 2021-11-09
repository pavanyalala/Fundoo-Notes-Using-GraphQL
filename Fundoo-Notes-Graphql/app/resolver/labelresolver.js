const labelModel = require('../model/label.model')
const Apolloerror = require('apollo-server-errors')

const labelresolvers = {
    Query : {
        getLabel : async () => {
            const labels = await labelModel.find()
            return labels
        }
    },
    Mutation : {
        createLabel: async (_, { path },) => {
           
                const checkLabel = await labelModel.findOne({ labelName: path.labelname });
                if (checkLabel) {
                    for (index = 0; index < checkLabel.noteId.length; index++) {
                        if (JSON.stringify(checkLabel.noteId[index]) === JSON.stringify(path.noteID)) {
                            return new Apolloerror.UserInputError('This note is already added');
                        }
                    }
                    checkLabel.noteId.push(path.noteID)
                    await checkLabel.save();
                    return "Note Pushed Into Existing Label Sucessfully"
                }
                const labelmodel = new labelModel({
                    noteId: path.noteID,
                    labelName: path.labelname,
                });
                await labelmodel.save();
                return "New Label Created Sucessfully"
        },

        deleteLabel: async(_,args)=>{

            const { id } = args
    
            await labelModel.findByIdAndDelete(id)
    
            return 'Label deleted successfully'
    
        }

    }
}

module.exports = labelresolvers;