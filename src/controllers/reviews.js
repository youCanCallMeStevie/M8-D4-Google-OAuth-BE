const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const ReviewsSchema = require("../schemas/reviewsSchema"); //importing the model, the wrapper of the schema
const ArticleSchema = require("../schemas/articlesSchema"); 
const ApiError = require("../classes/apiError");

exports.getReviewsController = async (req, res, next) => {
  try {
    const { reviews } = await ReviewsSchema.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (error) {
    console.log("getReviewsController error: ", error);
next(error)  }
};

exports.getOneReviewController = async (req, res, next) => {
  try {
    const { reviews } = await ReviewsSchema.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewsId) },
        },
      }
    );

    if (reviews && reviews.length > 0) {
      res.status(200).json({success: true, data: reviews});
    } else {

      throw new ApiError(404, `Review with id ${mongoose.Types.ObjectId(
        req.params.reviewsId
      )} not found`);
        
    }
  } catch (error) {
    console.log("getOneReviewController error: ", error);
    next(error)
  }
};

exports.postReviewController = async (req, res, next) => {
  try {
    const newReview = new ReviewsSchema(req.body);
    const { _id } = await newReview.save();
    console.log("new review", newReview);

    const articleId = req.params.id;
    console.log("article id", articleId);

    // const articleReviewed = await ArticleSchema.findById(articleId, { _id: 0 });
    // const reviewToInsert = { ...articleReviewed, date: new Date() };   both lines are same as the below
    const updated = await ArticleSchema.findByIdAndUpdate(
        articleId,
      {
        $push: {
          reviews: newReview,
        },
      },
      { runValidators: true, new: true }
    );
    if(!updated) {
      throw new ApiError(404, `Article not found`);
    }
} catch (error) {
    console.log("postReviewController: ", error);
    next(error);
  }
};

exports.editReviewController = async (req, res, next) => {
    try {
      const review = await ReviewsSchema.findByIdAndUpdate(
          req.params.reviewId,
          req.body,
          {
            runValidators: true,
            new: true,
          }
        );
      const { reviews } = await ArticleSchema.findOne(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
        {
          _id: 0,
          reviews: {
            $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
          },
        }
      );
      if (reviews && reviews.length > 0) {
        const oldReview = reviews[0].toObject();
        const modifiedReview = { ...oldReview, ...req.body };
        await ArticleSchema.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(req.params.id),
            "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
          },
          { $set: { "reviews.$": modifiedReview } },
          {
            runValidators: true,
            new: true,
          }
        );
        res.status(201).json({ success: true, data: modifiedReview });
      } else {
        const error = new Error(`Review with id ${req.params.id} not found`);
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      console.log("editReviewController: ", error);
      res.status(500).json({ success: false, errors: "Internal Server Error" });
      next(error);
    }
  };

exports.deleteReviewController = async (req, res, next) => {
  try {
    const review = await ReviewsSchema.findByIdAndDelete(req.params.reviewId); 
    const modifiedArticle = await ArticleSchema.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedArticle) {
      res.status(201).json({ success: true, data: "Review deleted" });
    } else {
      const error = new Error(`Review with id ${id} not found`);
      res.status(404).json({ success: false, errors: error });
      next(error);
    }
  } catch (error) {
    console.log("deleteReviewController: ", error);
    res.status(500).json({ success: false, errors: "Internal Server Error" });
    next(error);
  }
};
