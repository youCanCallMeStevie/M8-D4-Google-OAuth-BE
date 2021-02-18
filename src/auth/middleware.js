const jwt = require("jsonwebtoken");
const AuthorModel = require("../schemas/authorsSchema");
const { verifyJWT } = require("./tools");

const authorize = async (req, res, next) => {
  try {
    //const token = req.header("Authorization").replace("Bearer ", "")

    const token = req.cookies.accessToken; //comes with cookieParsar, and cookies is a field of the headers & will find the cookies in side
    const decoded = await verifyAccessToken(token);
    const user = await AuthorModel.findOne({ _id: decoded._id });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error("Authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else {
    const err = new Error("Only for admins!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authorize, adminOnlyMiddleware };
