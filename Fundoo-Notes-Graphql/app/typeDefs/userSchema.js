const { gql } = require('apollo-server-express');

module.exports =gql(`

type Query{
    getAllUsers : [User]
    getAllNotes : [Post]
    getNotes(id : ID) : Post
    getLabel:[GetLabels]
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
},

type Post{
    title:String!
    description:String
},

type GetLabels
{
    _id:ID
    userId:String
    noteId:[String]
    labelName:String
}

type Label{
    labelname:String!
},

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
    email : String!
    mailcode:String!
    newpassword:String!
},

input postInput{
    title:String!
    description:String
    email:String
},

input LabelInput{
    noteID:ID!
    labelname:String!
}

type Mutation{
    registerUser( path : UserInput):User
    loginUser( path : LoginInput):authUser
    forgotPassword( path : ForgotPassword):forgot
    resetPassword(path : ResetPassword):reset

    createNote(post : postInput):Post
    editNote(id:ID, post : postInput):Post
    deleteNote(id:ID):String

    createLabel(path:LabelInput):Label
    

}
`)

