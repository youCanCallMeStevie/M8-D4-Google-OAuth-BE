const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const ArticleModel = require("../schemas/articlesSchema");
const AuthorModel = require("../schemas/authorsSchema");
const ApiError = require("../classes/apiError");

exports.getArticlesController = async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await ArticleModel.countDocuments(query.criteria);
    const articles = await ArticleModel.find(
      query.criteria,
      query.options.fields
    )
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
      .populate("author");

    res.send({ links: query.links("/articles", total), articles });
  } catch (error) {
    console.log("getArticlesController error:", error);
    res.status(500).json({ error });
    next(error);
  }
};

exports.getOneArticleController = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    const foundArticle = await ArticleModel.findArticleWithAuthor(id).populate(
      "Author"
    );
    if (foundArticle) {
      res.status(200).json({ foundArticle });
    } else {
      throw new ApiError(404, `Article with id ${id} not found`);
    }
  } catch (error) {
    console.log("getOneArticleController error:", error);
    res.status(500).json({ error });
  }
};

exports.createNewArticleController = async (req, res, next) => {
  try {
    const article = {...req.body, author: mongoose.Types.ObjectId(req.user._id)}
const newArticle = new ArticleModel(article)
const {_id} = await newArticle.save()//save needs to be async as it is returning a promise, save is similar to write. when we save the record in the db, the new document will be returned
    res.status(201).json({ _id });
  } catch (error) {
    console.log("createNewArticleController:", error);
    res.status(500).json({ error });
    next(error);
  }
};

exports.editArticleController = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (article) {
      res.status(201).json({ article });
    } else {
      throw new ApiError(404, `Article with id ${req.params.id} not found`);
    }
  } catch (error) {
    console.log("editArticleController:", error);
    res.status(500).json({ success: false, errors: "Internal Server Error" });
    next(error);
  }
};

exports.deleteArticleController = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);
    if (article) {
      res.status(201).json({ success: true, data: "deleted" });
    } else {
      throw new ApiError(404, `Article with id ${req.params.id} not found`);
    }
  } catch (error) {
    console.log("deleteArticleController:", error);
    next(error);
  }
};

exports.updateClap = async (req, res) => {
  const respond = await ArticleModel.addClap(req.params.id, req.body);
  res.send(respond);
};

exports.removeClap = async (req, res) => {
  const respond = await ArticleModel.removeClap(req.params.id, req.body);
  res.send(respond);
};

exports.calculateClap = async (req, res) => {
  const respond = await ArticleModel.countClap(req.params.id, req.body);
  res.send(respond);
};
