const UserData = require('../models/user.model')
const joiValidation = require('../utilities/validation')
const bcryptpass = require('../utilities/bcrypt')

const Apollerror = require('apollo-server-errors')
const bcrypt = require('bcrypt')


const resolvers = {
    Query : {

        getAllUsers : async () => {
            return await UserData.find() 

        },
    },
    Mutation:{

        // creating new user

        registerUser : async (_,{path}) => {
          const user = new UserData({
              firstName : path.firstName,
              lastName  : path.lastName,
              email     : path.email,
              password  : path.password,
            })

            const Validation = joiValidation.authRegister.validate(user._doc);
            if(Validation.error){
                return new Apollerror.ValidationError(Validation.error)
            }

            const existinguser = await UserData.findOne({ email:path.email})
            if(existinguser){
                 return new Apollerror.UserInputError("Email already exists")
            }

            bcryptpass.hash(path.password, (error,data)=>{
                if(data){
                    user.password = data
                    console.log(data)
                }else{
                    throw error;
                }
                user.save();
            })
            return user;
 
        },

        
    }

};

module.exports = resolvers;