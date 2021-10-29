const UserData = require('../models/user.model')
const joiValidation = require('../utilities/validation')
const bcryptpass = require('../utilities/bcrypt')
const SendByMail = require('../utilities/nodeMail')
const mailModel = require('../models/mail.model')

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

        forgotPassword: async (_, { path }) => {
              const userPresent = await UserData.findOne({ email: path.email });
              if (!userPresent) {
                return new Apollerror.AuthenticationError('User is not Registered');
              }
              const check = await mailModel.find({ mail: path.email })
              if (check.length != 0) {
                return new Apollerror.UserInputError('Mail code already sent');
              }
              SendByMail.getMessageByMail(userPresent.email, (data) => {
                if (!data) {
                  return new Apollerror.ApolloError('Failed to send Email');
                }
              });
              return ({
                email: userPresent.email,
              });
        },

        resetPassword : async(_,{ path },context) => {

            const userPresent = await mailModel.find({ mail: context.email });
            if (userPresent.length === 0) {
              return new Apollerror.UserInputError('Mailcode expired');
            }

            const checkCode = SendByMail.sendCode(path.Code, userPresent);
            if (checkCode === 'false'){
                return new Apollerror.AuthenticationError('Invalid mailcode');
            }

            const saveToUser = await UserData.findOne({ mail: context.email })
            bcryptpass.hash(path.newpassword, (data) => {
              if (data) {
                saveToUser.password = data;
                saveToUser.save();
              } else {
                return new Apollerror.ApolloError('Internal Server Error');
              }
            });
            return ({
              email: context.email,
              newpassword: path.newpassword,
            });
            
        }
    
    } 

};

module.exports = resolvers;