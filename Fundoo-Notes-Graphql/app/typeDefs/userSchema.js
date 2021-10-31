const { gql } = require('apollo-server-express');

module.exports =gql(`

type Query{
    getAllUsers : [User]
},

type User {
    id:ID!
    firstName:String!
    lastName:String!
    email:String!
    password:String!
},
type authUser{
    id:ID!
    token:String
    firstName:String
    lastName:String
    email:String

},

type forgot{
    email:String!
},

type reset{
    email:String!
    newpassword:String
}

input UserInput{
    firstName:String!
    lastName:String!
    email:String!
    password:String!
},

input LoginInput{
    email:String!
    password:String!
},

input ForgotPassword{
    email:String!
},

input ResetPassword
{
    mailcode:String!
    newpassword:String!
},

type Mutation{
    registerUser( path : UserInput):User
    loginUser( path : LoginInput):authUser
    forgotPassword( path : ForgotPassword):forgot
    resetPassword(path : ResetPassword):reset
}
`)

