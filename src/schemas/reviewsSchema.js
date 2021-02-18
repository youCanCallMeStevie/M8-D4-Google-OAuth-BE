const mongoose = require("mongoose");
const { Schema } = require("mongoose");
//const { Schema, model } = require("mongoose") same as above, but we're only using model in this case


const ReviewsSchema = new Schema(
  {
    text: { type: String, required: true },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewsSchema);
