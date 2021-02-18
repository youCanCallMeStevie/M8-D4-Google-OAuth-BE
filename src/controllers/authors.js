const express = require("express");
const mongoose = require("mongoose");
const AuthorModel = require("../schemas/authorsSchema"); //importing the model, the wrapper of the schema
const ApiError = require("../classes/apiError");


exports.getAuthorsController = async (req, res, next) => {
  try {
    const authors = await AuthorModel.find(req.query);
    if (authors.length !== 0) {
      res.status(200).send(authors);
    } else {
      throw new ApiError(404, `Authors not found`);
    }
  } catch (error) {
    console.log("getAuthorsController error: ", error);
    next(error);
  }
};

exports.getOneAuthorController = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    const author = await AuthorModel.findById(id);
    if (author) {
      res.status(200).json({ author });
    } else {
      throw new ApiError(404, `Author with id ${id} not found`);
    }
  } catch (error) {
    console.log("getOneAuthorController error: ", error);
    next(error);
  }
};

exports.postAuthorController = async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    const { _id } = await newAuthor.save();
    console.log("newAuthor", newAuthor);
    res.status(200).json({success: true, _id: _id})
  } catch (error) {
    console.log("postAuthorController error: ", error);
    next(error);
  }
};

exports.editAuthorController = async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndUpdate(req.params.id, req.body);
    if (author) {
      res.status(201).json({ success: true, data: "edited" });
    } else {
      throw new ApiError(404, `Author with id ${req.params.id}  not found`);
    }
  } catch (error) {
    console.log("editAuthorController error: ", error);
    next(error);
  }
};

exports.deleteAuthorController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const author = await AuthorModel.findByIdAndDelete(id);
    if (author) {
      res.status(201).json({ success: true, data: "deleted" });
    } else {
      throw new ApiError(404, `Author with id ${id}  not found`);
    }
  } catch (error) {
    console.log("deleteAuthorController error: ", error);
    next(error);
  }
};
