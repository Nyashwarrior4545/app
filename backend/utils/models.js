//models.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jokesSchema = new Schema(
  {
    jokeId: String,
    name: String,
    category: String,
    status: String,
    quantity: String,
    price: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = {
  Joke: mongoose.model("jokes", jokesSchema),
};