const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User{
    id : ID
    firstName : String!
    lastName : String!
    email : String!
    password : String!
}

type LoginUser{
    email : String!
    password : String!
}


input UserInput{
    firstName : String!
    lastName : String!
    email : String!
    password : String!
}

input LoginInput{
    email:String
    password:String
}


type Query{
    getAllUsers : [User] 
}

type Mutation {
    registerUser( user : UserInput ):User
    loginUser( args : LoginInput ):LoginUser
}
`;

module.exports = typeDefs;
