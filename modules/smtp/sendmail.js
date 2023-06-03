const transporter = require("./setupsmtp");

async function sendEmail(supervisorMailId, requestId) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: supervisorMailId,
    subject: "Your request Id",
    text: `You request has been sent successfully sent to the finace advisor .\n REQUEST ID : ${requestId} . Please save for future reference . \n Thank you. `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmail;
