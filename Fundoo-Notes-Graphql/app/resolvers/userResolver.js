const UserData = require('../models/user.model')
const joiValidation = require('../utilities/validation')
const bcryptpass = require('../utilities/bcrypt')

const Apollerror = require('apollo-server-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
        loginUser : async(_,{path})=>{
            const login ={
                email:path.email,
                password:path.password
            }
            const Validationlogin = joiValidation.authLogin.validate(login);
            if(Validationlogin.error){
                return new Apollerror.ValidationError(Validationlogin.error)
            }
            const userPresent = await UserData.findOne({ email: path.email });
            if (!userPresent) {
              return new Apollerror.AuthenticationError('Eamil ID is not registered');
            }
            const correct = await  bcrypt.compare(path.password, userPresent.password);
            if (! correct) {
              return new Apollerror.AuthenticationError('wrong password' );
            }
            const token =jwt.sign({  email:path.email  },"My_secrete Key",{
                expiresIn:'5min'
            })
            return{ userId:userPresent.id,
                    firstName:userPresent.firstName,
                    lastName:userPresent.lastName,
                    token:token,
                    tokenExpiration:5000
                  }

        },
        
    }
};

module.exports = resolvers;