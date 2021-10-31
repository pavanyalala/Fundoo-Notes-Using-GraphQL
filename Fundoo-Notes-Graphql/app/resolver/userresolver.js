const bcrypt = require('bcrypt');
const ApolloError = require('apollo-server-errors');


const userModel = require('../model/user.model');
const bcryptPassword = require('../utilities/bcrypt');
const joiValidation = require('../utilities/validation');
const jwt = require('../utilities/token');
const mailModel = require('../model/mail.model');
const sendinfobymail = require('../utilities/sendinfobymail');


const reslover ={
    Query : {
        
        getAllUsers : async () => {
            return await userModel.find() 
        }
    },

    Mutation : {
        registerUser: async (_, { path }) => {
            const usermodel = new userModel({
              firstName: path.firstName,
              lastName: path.lastName,
              email: path.email,
              password: path.password,
            });
            const registerValidation = joiValidation.authRegister.validate(usermodel._doc);
            if (registerValidation.error) {
                return new ApolloError.ValidationError(registerValidation.error);
            }
            const existingUser = await userModel.findOne({ email: path.email });
            if (existingUser) {
                return new ApolloError.UserInputError('User Already Exists');
            }
            bcryptPassword.hashpassword(path.password, (error, data) => {
                if (data) {
                  usermodel.password = data;
                } else {
                  throw error;
                }
                usermodel.save();
            });
              return usermodel;
        },
        
        loginUser: async (_, { path }) => {
            
            const loginmodel = {
              email: path.email,
              password: path.password,
            };
            const loginValidation = joiValidation.authLogin.validate(loginmodel);
            if (loginValidation.error) {
            return new ApolloError.ValidationError(loginValidation.error);
            }
            const userPresent = await userModel.findOne({ email: path.email });
            if (!userPresent) {
                return new ApolloError.AuthenticationError('Invalid Email id');
            }
            const check = await bcrypt.compare(path.password, userPresent.password);
            if (!check) {
                return new ApolloError.AuthenticationError('Invalid password');
            }
            const token = jwt.getToken(userPresent);
            if (!token) {
                throw new ApolloError.ApolloError('Internal Server Error');
            } return {
                id: userPresent.id,
                token,
                firstName: userPresent.firstName,
                lastName: userPresent.lastName,
                email: userPresent.email,
            };   
        },
        forgotPassword: async (_, { path }) => {
    
            const userPresent = await userModel.findOne({ email: path.email });
            if (!userPresent) {
                return new ApolloError.AuthenticationError('User is not Registered');
            }
            const check = await mailModel.find({ mail: path.email })
            if (check.length != 0) {
                return new ApolloError.UserInputError('Mail code already sent');
            }
            sendinfobymail.getMailDetails(userPresent.email, (data) => {
            if (!data) {
                return new ApolloError.ApolloError('Failed to send Email');
            }
            });
            return ({
              email: userPresent.email,
            });
        },

        resetPassword: async(_,{path})=>{
            const checkinguser = await userModel.findOne({ email:path.email})
            if(!checkinguser){
                return new ApolloError.AuthenticationError('user id does not exist')
            }
            const checkingcode = sendinfobymail.sendCode(path.code)
            if(checkingcode === 'false'){
                return new ApolloError.AuthenticationError('wrong code enter valid code')
            }
            bcryptPassword.hashpassword(path.newpassword,(data)=>{
                if(data){
                    checkinguser.password=data;
                    checkinguser.save();
                }else{
                    return 'error'
                }
            })
            return({
                email:path.email,
                newpassword:path.newpassword,
                
            })
         
        } 
    }
}
        
      
module.exports = reslover;