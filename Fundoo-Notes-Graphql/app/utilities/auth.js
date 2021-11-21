const jwt = require('jsonwebtoken')

module.exports = ({ req }) => {
    const token = req.headers.authorization 
    try {
        if (!token) {
            return req=false;
        }
            let decodedToken;   
            decodedToken=jwt.verify(token, process.env.accessToken)       
            return decodedToken;
        }
    
    catch (err) {
        return false;
    }
    
};