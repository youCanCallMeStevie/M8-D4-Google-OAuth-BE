const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AuthorModel = require("../schemas/authorsSchema");
const { authenticate } = require("./tools");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BE_URL}/googleRedirect`,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      const newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value, //because this is returning an array
        role: "User",
        refreshTokens: [],
      };

      try {
        const user = await AuthorModel.findOne({ googleId: profile.id });
        //if google user exists, then generate tokens
        if (user) {
          const tokens = await authenticate(user);
          done(null, { user, tokens }); //first parameter is error
        } else {
          //if google user does not exist, just save it into the db and generate tokens for user

          const createdUser = new AuthorModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          done(null, { user: createdUser, tokens });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
