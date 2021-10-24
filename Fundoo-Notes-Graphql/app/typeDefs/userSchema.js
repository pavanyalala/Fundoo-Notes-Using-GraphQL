const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User{
    _id:ID!
    firstName : String
    lastName : String
    email : String
    password : String
}

input UserInput{
    firstName : String!
    lastName : String
    email : String
    password : String
}

type Query{
    getAllUsers : [User] 
}

type Mutation {
    registerUser( path : UserInput ):User
}
`;

module.exports = typeDefs;
