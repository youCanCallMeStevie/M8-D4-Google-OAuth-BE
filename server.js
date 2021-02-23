const express = require("express");
const listEndpoints = require("express-list-endpoints");
const articlesRoute = require("./src/routes/articleRoute");
const authorsRoute = require("./src/routes/authorRoute");
const logInRoute = require("./src/routes/logInRoute");
const passport = require("passport");
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./src/errorHandlers");
const mongoose = require("mongoose");
const cors = require("cors");
const oauth = require("./src/auth/oauth"); //import so that the google strategy can be used by passport, but it isn't called any where


//INITIAL SETUP
const server = express();
const port = process.env.PORT || 4000

//MIDDLEWARES

const whitelist = [`${process.env.FE_URL}`]; //whose allowed, which can be an array of strings
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //credentials=cookies, and letting cors know that cookies are allowed
};

server.use(cors(corsOptions)); //if using cookies, you can't leave cors empty
server.use(passport.initialize())
server.use(express.json());

//ROUTES
server.use("/articles", articlesRoute);
server.use("/authors", authorsRoute);
server.use("/", logInRoute)



//ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      // if (server.get("env") === "production")
        // console.log("Server is running on CLOUD on PORT:", port);
      console.log("Server is running LOCALLY on PORT:", port);
    })
  )
  .catch(err => console.log(err));
