const express = require('express')
const { ApolloServer, gql} = require('apollo-server-express');

const typeDefs = require('./app/typeDefs/userSchema');
const resolvers = require('./app/resolvers/userResolver');
const dbconfig = require('./config/db.config')

require('dotenv').config();

dbconfig.dbConnection();

async function startServer(){
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start()

    apolloServer.applyMiddleware({ app });

    app.use((req,res) => {
        res.send("hello from express apollo server");
    });

   
    app.listen(4000, () => console.log('server is running on port 4000'))
}
startServer();