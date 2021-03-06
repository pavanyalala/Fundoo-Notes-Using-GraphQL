const labelModel = require('../model/label.model')
const Apolloerror = require('apollo-server-errors')

const labelresolvers = {
    Query : {
        getAllLabel : async () => {
            const labels = await labelModel.find()
            return labels
        },
        getLabel: async(_,{id})=>{
            const label = await labelModel.findById(id);
            return label
         }
    },
    Mutation : {
        createLabel: async (_, { path },context) => {
            if(!context.id){
                return new Apolloerror.AuthenticationError('UnAuthenticated');

            }
                const labelmodel = new labelModel({
                    userId: context.id,
                    labelName: path.labelname,
                });
                await labelmodel.save();
                return "New Label Created Sucessfully"
        },

        deleteLabel: async(_,args)=>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }

            const { id } = args
    
            await labelModel.findByIdAndDelete(id)
    
            return 'Label deleted successfully'
    
        },

        editLabel: async(_,args)=>{
            if(!context.id){
                return new ApolloError.AuthenticationError('UnAuthenticated');

            }

            const {id} =args

           const {labelname} =args.path

           const label = await labelModel.findByIdAndUpdate(id,{labelname},{new :true})

           return label
        }, 

    }
}

module.exports = labelresolvers;