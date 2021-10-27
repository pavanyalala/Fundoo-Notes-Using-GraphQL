const UserData = require('../models/user.model')
const joiValidation = require('../utilities/validation')
const bcryptpass = require('../utilities/bcrypt')
const SendByMail = require('../utilities/nodeMail')

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
            const token =jwt.sign({  email:path.email  },process.env.accessToken,{
                expiresIn:'5mins'
            })
            return{ userId:userPresent.id,
                    firstName:userPresent.firstName,
                    lastName:userPresent.lastName,
                    token:token,
                    tokenExpiration:5000
                  }

        },

        forgotPassword : async(_,{path}) => {
            const checkUser = await UserData.findOne({email : path.email});
            if( ! checkUser){
                return new Apollerror.AuthenticationError('Email not registered')
            }

            SendByMail.getMessageByMail(checkUser.email,(data) => {
                if(!data){
                    return new Apollerror.ApolloError('otp sending is failed')
                }
            })
            return ({
                email:path.email,
                message:'secret code is sent to your register mail id'
            })
        },

        resetPassword : async(_,{path}) => {
            const checkingUser = await UserData.findOne({email : path.email})
            if(! checkingUser){
                return new Apollerror.ApolloError.AuthenticationError('Email not registered')
            }
            const checkCode = SendByMail.passCode(path.code)
            if(checkCode === 'false'){
                return new Apollerror.AuthenticationError('code not valid')
            }
            bcryptpass.hash(path.newPassword, (error,data) => {
                if(data){
                    checkingUser.password = data;
                    checkingUser.save();
                }else{
                    return 'error'
                }
            })
            return({
                email : path.email,
                newPassword : path.newPassword,
                message :'new password is updated'
            })
        }
    }   

};

module.exports = resolvers;