const { gql } = require('apollo-server-express');

module.exports =gql(`

type Query{
    getAllUsers : [User]
    getAllNotes : [Post]
    getNotes(id : ID) : Post
    getAllLabel : [GetLabels]
    getLabel(id : ID) : GetLabels
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
    message:String
    
},

type GetLabels{
    _id:ID
    labelName:String
},

type Label{
    labelname:String
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
    
},

input LabelInput{
    labelname:String!
},

input DeleteLabelInput{
    labelname:String!
}

input editLabelInput{
    labelname:String!
}
input addLabelInput{
    id:ID
    noteID:String
    labeID:String
}
    

type Mutation{
    registerUser( path : UserInput):User
    loginUser( path : LoginInput):authUser
    forgotPassword( path : ForgotPassword):forgot
    resetPassword(path : ResetPassword):reset

    createNote(post : postInput):Post
    editNote(id:ID, post : postInput):Post
    deleteNote(id:ID):String
    saveLabelToNote(noteID: ID!, label_ID: ID!): Post
    deleteLabelToNote(noteID: ID!, label_ID: ID!): Post

    createLabel(path:LabelInput):String
    deleteLabel(id:ID):String
    editLabel(id:ID, path: LabelInput):Label
}
`)

