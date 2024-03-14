const nodemailer= require("nodemailer")

const createTransporter = () =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "choudharyanuj1712@gmail.com",
          pass: process.env.MAIL_PASSWORD,
        }
      });

      return transporter
}

module.exports = {createTransporter}