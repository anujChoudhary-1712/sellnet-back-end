const { createTransporter } = require("./createTransporter");

const sendTransporter = (user) => {
  const transporter = createTransporter();

  let mailOptions = {
    from: "choudharyanuj1712@gmail.com",
    to: user.email,
    subject: "Verify your email ...",
    text: `<p>Hello ${user.fullname} , Kindly verify your email by clicking the following link ...</p>
        <a href='${process.env.CLIENT_URL}/verifyEmail?emailToken=${user.emailToken}'>Verify your email</a>`,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = sendTransporter
