//FCM
const admin = require("firebase-admin");

module.exports.initFcm = () => {
  const serviceAccount = require("../../insta-post-20842-firebase-adminsdk-l90k9-b0a2d695d6.json");
  certPath = admin.credential.cert(serviceAccount);
  admin.initializeApp({
    credential: certPath,
  });
};
module.exports.admin = admin;
