const express = require("express");
const passport = require("passport");

const AuthorModel = require("../schemas/authorsSchema");
const ApiError = require("../classes/apiError");
const { authenticate, refresh } = require("../auth/tools");

exports.login = async (req, res, next) => {
  try {
    //Check credentials
    const { email, password } = req.body;
    const user = await AuthorModel.findByCredentials(email, password);
    //Generate token
    const { accessToken, refreshToken } = await authenticate(user);
    //Send back tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });
    res.send("Ok");
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

exports.refreshTokenController= async (req, res, next) => {
  try {
    // Grab the refresh token

    console.log(req.cookies);
    const oldRefreshToken = req.cookies.refreshToken;

    // Verify the token

    // If it's ok generate new access token and new refresh token

    const { accessToken, refreshToken } = await refresh(oldRefreshToken);

    // send them back

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

exports.googleRedirectController = async (req, res, next) => {
  try {
    console.log(req.user)
    //setting a cookie and giving it a name
    res.cookie("accessToken", req.user.tokens.accessToken, 
    //providing options, which means the JS code cannot check the content
    {
      httpOnly: true,
      //anther option is 'secure' and this is regarding using https
    });
    //setting a cookie and giving it a name

    res.cookie("refreshToken", req.user.tokens.refreshToken, {
      httpOnly: true,
      //determine when the cookie needs to be used
      path: "/refreshToken",
    });

    res.status(200).redirect(`${process.env.FE_URL}/articles`); //sending back to FE & there is no body in a redirect
  } catch (error) {
    next(error);
  }

}