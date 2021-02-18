const express = require("express");

const router = express.Router();
const {
  getAuthorsController,
  getOneAuthorController,
  // postAuthorController,
  editAuthorController,
  deleteAuthorController,
} = require("../controllers/authors");


const {authorize} = require("../auth/middleware")

const validation = require("../validation/validationMiddleware");
const valSchema = require("../validation/validationSchema");

router.get("/", authorize, getAuthorsController);
router.get("/:id", authorize, getOneAuthorController);
// router.post("/", authorize, validation(valSchema.authorSchema), postAuthorController);
router.put("/:id", authorize, validation(valSchema.authorSchema), editAuthorController);
router.delete("/:id", authorize, deleteAuthorController);


module.exports = router;
