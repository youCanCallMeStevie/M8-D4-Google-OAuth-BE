const express = require("express");

const router = express.Router();
const { postAuthorController } = require("../controllers/authors");

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

module.exports = router;
