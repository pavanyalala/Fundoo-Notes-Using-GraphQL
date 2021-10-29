const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User{
    id        :ID!
    firstName : String
    lastName  : String
    email     : String
    password  : String
},

type AuthUser{
    id              : ID
    firstName       : String
    lastName        : String
    email           : String
    token           : String
    tokenExpiration : Int!
},

type Forgot{
    email   : String!
    message : String
},

type Reset{
    email       :String!
    newPassword :String
},

input UserInput{
    firstName : String!
    lastName  : String
    email     : String
    password  : String
},

input LoginInput{
    email    : String!
    password : String
},

input ForgotPassword{
    email : String!
},

input ResetPassword{
    email        : String!
    Code         : String
    newPassword  : String
}

type Query{
    getAllUsers : [User] 
},

type Mutation {
    registerUser( path : UserInput ):User
    loginUser(path : LoginInput):AuthUser
    forgotPassword(path : ForgotPassword):Forgot
    resetPassword(path : ResetPassword):Reset
}
`;

module.exports = typeDefs;
