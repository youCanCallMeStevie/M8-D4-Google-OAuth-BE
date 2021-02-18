const express = require("express");
const passport = require("passport");

const router = express.Router();
const { postAuthorController} = require("../controllers/authors");
const {  googleRedirectController, refreshTokenController } = require("../controllers/login");

const { login, logout } = require("../controllers/login");

const validation = require("../validation/validationMiddleware");
const valSchema = require("../validation/validationSchema");

router.post(
  "/register",
//   validation(valSchema.authorSchema),
  postAuthorController
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refreshToken", refreshTokenController);
router.get("/googleRedirect",passport.authenticate("google"), googleRedirectController);
router.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

module.exports = router;
