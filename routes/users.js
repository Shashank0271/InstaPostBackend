const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
  updateUser,
  followUser,
} = require("../controllers/user_controller");

router.route("/").post(createUser).patch(updateUser);
router.route("/:id").get(getUser);
router.route("/follow").post(followUser);

module.exports = router;
