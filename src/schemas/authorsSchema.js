const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs")

const AuthorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: false,
    },
    password: { type: String, required: false, minlength: 8 },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      required: "An email address is required",
    },
    refreshTokens: [{ token: { type: String } }],
    googleId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.methods.toJSON = function () {
  const author = this
  const authorObject = author.toObject()

  delete authorObject.password
  delete authorObject.__v

  return authorObject
}

AuthorSchema.statics.findByCredentials = async function (email, plainPW) {
  const author = await this.findOne({ email })
  // console.log(author)

  if (author) {
    const isMatch = await bcrypt.compare(plainPW, author.password)
    if (isMatch) return author
    else return null
  } else {
    return null
  }
}

AuthorSchema.pre("save", async function (next) {
  const author = this
  const plainPW = author.password

  if (author.isModified("password")) {
    author.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})


const AuthorModel = model("Author", AuthorSchema);
module.exports = AuthorModel;
