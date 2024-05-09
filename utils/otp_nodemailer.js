const nodemailer = require('nodemailer')

const sendMail = async (email,name,otp) => {


  // connect with the smtp
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
      user: "arshadtp89@gmail.com",
      pass: "lyzd iior rapc wnxz",
    }
  });


  let info = await transporter.sendMail({
    from: '"arshad " <arshadtp89@gmail.com>', // sender address
    to: email, // list of receivers
    subject: `Hi ${name}`, // Subject line
    text: `Your OTP is: ${otp}`, // plain text body
    html: `<b>Your OTP is: ${otp}</b>`, // html body
  }); 
};

module.exports = sendMail;