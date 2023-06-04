const getPostLink = require("../firebase/deep_link");
const cron = require("node-cron");
const Post = require("../../models/Posts");
const User = require("../../models/User");
const sendMail = require("../smtp/sendmail");

async function generateMailJob() {
  const currentDate = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(currentDate.getDate() - 7);
  //   console.log(currentDate.toISOString());
  const list = await Post.find({ createdOn: { $gte: oneWeekAgo } }, "title _id")
    .sort({ likes: -1 })
    .limit(5);
    
  const emails = await User.find({}, "email");
  const emailList = [];
  emails.forEach((element) => {
    emailList.push(element["email"]);
  });
  const emailString = emailList.join(' ');

  const dynamicLinkList = [];
  for (const element of list) {
    const postID = element["_id"].toString();
    const dynamicLink = await getPostLink(postID);
    dynamicLinkList.push(dynamicLink);
  }

  let emailBody = "The top posts from this week are <br>";
  const postLinks = dynamicLinkList.join("<br>");
  emailBody = emailBody + postLinks;

  await sendMail(emailString, "Weekly digest", emailBody);
}

cron.schedule("*/10 * * * * *", generateMailJob);
