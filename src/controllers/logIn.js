const express = require("express");
const AuthorModel = require("../schemas/authorsSchema");
const ApiError = require("../classes/apiError");
const { authenticate } = require("../auth/tools");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthorModel.findByCredentials(email, password);
    console.log(user);
    if (user === null) {
      throw new ApiError(404, `User  not found`);
    } else if (user.error) {
      throw new ApiError(403, `${user.error}`);
    } else {
      const token = await authenticate(user);
      res.status(201).json({ token });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
