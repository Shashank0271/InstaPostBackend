const axios = require("axios");
const webApiKey = process.env.FIREBASE_WEB_API_KEY;
const getPostLink = async function (postID) {
  const requestBody = {
    dynamicLinkInfo: {
      domainUriPrefix: process.env.DOMAIN_URI_PREFIX,
      link: `https://www.instapost.com/post?pid=${postID}`,
      androidInfo: {
        androidPackageName: "com.example.insta_post",
      },
    },
  };
  const response = await axios.post(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${webApiKey}`,
    requestBody
  );
  console.log(response);
  console.log(response.data);
  return response.data.shortLink;
};

module.exports = getPostLink;
