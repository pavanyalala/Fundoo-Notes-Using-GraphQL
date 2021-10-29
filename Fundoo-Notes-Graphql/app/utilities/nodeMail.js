const nodemailer = require('nodemailer')
const UserData = require('../models/user.model')
const mailModel = require('../models/mail.model')


//var code =null
class SendByMail { 
    getMessageByMail =  (receiver,callback) => {

        var code = (Math.random().toString(36).substring(5));

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env.Mail,
                pass : process.env.Pass
            }
        });
        
        const mailOptions = {
            from : process.env.Mail,
            to : receiver,
            subject : 'Fundoo notes ForgotPassword Link',
            text : code
        };
        
        transporter.sendMail(mailOptions, async function (error, data) {
            console.log("Email sent successfully");
            if (error) {
              console.log("Error " + error);
              return callback("Error", null);
            } else {
              const userPresent = await UserData.findOne({ email: receiver });
              const mailmodel = new mailModel({
                mail: userPresent.email,
                tempcode: code
              })
              await mailmodel.save();
              return callback(null, "Email sent successfully")
            }
          });
    }

    sendCode = (receiver, user) => {
        if (receiver === user[0].tempcode) {
          return 'true'
        }
        return 'false'
      
    }
}

module.exports = new SendByMail()