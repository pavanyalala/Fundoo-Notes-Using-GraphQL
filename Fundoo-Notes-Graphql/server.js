const express = require('express')
const { ApolloServer} = require('apollo-server-express');

const typeDefs = require('./app/typedefs/userschema');
 const resolvers = require('./app/resolver/index');
const dbconfig = require('./config/db.config')
const auth = require('./app/utilities/auth')

require('dotenv').config();

const client = require('./config/redis.config');

client.SET("foo","Bar")

client.GET('foo',(err, value) => {
    if(err) console.log(err.message)
    console.log.log(value);
})

dbconfig.dbConnection();

//async function startServer(){
    
     const apolloServer = new ApolloServer({
         typeDefs ,
         resolvers,
         context : auth
     });
    const app = express()

    //await apolloServer.start()

    apolloServer.applyMiddleware({ app });

    // app.use((req,res) => {
    //     res.send("hello from express apollo server");
    // });

   
    app.listen(process.env.Port, () => console.log('server is running '))

//}
//startServer();