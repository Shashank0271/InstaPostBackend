const transporter = require("./setupsmtp");

async function sendEmail(usersMailIds, subject, text) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: usersMailIds,
    subject: subject,
    // text: "dont use this for new line",
    html: text,
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
