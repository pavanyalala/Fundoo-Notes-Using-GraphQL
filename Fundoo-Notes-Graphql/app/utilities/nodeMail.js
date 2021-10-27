const nodemailer = require('nodemailer')

class SendByMail { 
    getMessageByMail =  () => {

        let code = (Math.random().toString(36).substring(5));

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env.Mail,
                pass : process.env.Pass
            }
        });
        
        const mailOptions = {
            from : process.env.Mail,
            to : 'pavanyalala4508@gmail.com',
            subject : 'Fundoo notes ForgotPassword Link',
            text : code
        };
        
        transporter.sendMail(mailOptions, function(error, data){
            if (error) {
                console.log(error);
            }else {
                console.log('Email sent sucessfully');
            }
        });
    }

    passCode = (data) => {
        if(data == code){
            console.log("Correct code");
            return true 
        }else{
            console.log("Wrong code");
            return false
        }
    }
}

module.exports = new SendByMail()