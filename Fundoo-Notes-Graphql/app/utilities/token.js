const jwt = require('jsonwebtoken');
class GetToken {
    getToken = (details) => {
        const token = jwt.sign({
            id: details._id,
            email: details.email
        }, process.env.accessToken)
        return token;
    }
}
module.exports=new GetToken();