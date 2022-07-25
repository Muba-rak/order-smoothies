const express = require("express");
const router = express.Router();
const {
  getHomepage,
  getSmoothiePage,
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout
} = require("../controller/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", getHomepage);
router.get("/smoothies", requireAuth, getSmoothiePage);
router.route("/signup").get(signup_get).post(signup_post);
router.route("/login").get(login_get).post(login_post);
router.get('/logout', logout)

//router.post("/test", signup_post2);
//router.get("/signup", signup_get);
//router.post("/signup", signup_post);
//router.get("/login", login_get);
//router.post("/login", login_post);

module.exports = router;
