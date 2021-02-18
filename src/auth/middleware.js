const jwt = require("jsonwebtoken")
const AuthorModel = require("../schemas/authorsSchema")
const { verifyJWT } = require("./tools")

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = await verifyJWT(token)
    const user = await AuthorModel.findOne({
      _id: decoded._id,
    })
console.log("token", token)
    if (!user) {
      throw new Error()
    }

    req.token = token
    req.user = user
    next()
  } catch (e) {
    const err = new Error("Please authenticate")
    err.httpStatusCode = 401
    next(err)
  }
}

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next()
  else {
    const err = new Error("Only for admins!")
    err.httpStatusCode = 403
    next(err)
  }
}

module.exports = { authorize, adminOnlyMiddleware }
