const express = require("express");

const router = express.Router();
const {
  getArticlesController,
  getOneArticleController,
  createNewArticleController,
  editArticleController,
  deleteArticleController,
  updateClap,
  removeClap,
  calculateClap
} = require("../controllers/article");

const {
  getReviewsController,
  getOneReviewController,
  postReviewController,
  editReviewController,
  deleteReviewController,
} = require("../controllers/reviews");

const {authorize} = require("../auth/middleware")


const validation = require("../validation/validationMiddleware");
const valSchema = require("../validation/validationSchema");


router.get("/", getArticlesController);
router.get("/:id", getOneArticleController);
router.post("/", authorize, validation(valSchema.articleSchema), createNewArticleController);
router.put("/:id", authorize, validation(valSchema.articleSchema), editArticleController);
router.delete("/:id", authorize, deleteArticleController);
router.get("/:id/reviews", getReviewsController);


router.get("/:id/reviews/:reviewId", getOneReviewController);
router.post("/:id", authorize, validation(valSchema.reviewSchema), postReviewController);
router.put("/:id/reviews/:reviewId", authorize, validation(valSchema.reviewSchema), editReviewController);
router.delete("/:id/reviews/:reviewId", authorize, deleteReviewController);

router.post("/:id/clap", authorize, updateClap);
router.post("/:id/removeClap", authorize, removeClap);
router.get("/:id/calculateClap", calculateClap);


module.exports = router;
