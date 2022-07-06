import nodemailer from "nodemailer";

export const sendMail = async (emailData) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Gallery Web Team" <myra.abshire78@ethereal.email>', // sender address
    to: "myra.abshire78@ethereal.email", // list of receivers
    subject: "Please verify your email", // Subject line
    text: "Hi there, please follow the link to verify your email", // plain text body
    html: `
    <p>Hi ${emailData.fName}</p>
    <br/>
    <br/>
    Please follow the link below to verify your email in order to login to your account.
    <br/>
    <br/>
    <a href="${emailData.url}">${emailData.url}<a/>
    <br/>
    <br/>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
