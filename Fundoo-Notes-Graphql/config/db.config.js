const mongoose = require('mongoose');
exports.dbConnection=()=>{
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect( process.env.db_URL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");   
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})}