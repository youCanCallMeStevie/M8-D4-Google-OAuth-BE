const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const ArticleSchema = new Schema(
  {
    headLine: { type: String, required: true },
    subHead: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      name: { type: String, required: true },
      img: { type: String},
    },
    cover: { type: String, required: true },
    reviews: [
      { text: { type: String, required: true } },
      { user: { type: String } },
      { date: { type: Date } },
    ],
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true},
    claps: [{ userId: { type: Schema.Types.ObjectId, ref: "Author" } }],
  },
  { timestamps: true }
);

ArticleSchema.static("findArticleWithAuthor", async function (id) {
  const book = await ArticleModel.findById(id).populate("author");
  return book;
});

const ArticleModel = model("Article", ArticleSchema);
module.exports = ArticleModel;
