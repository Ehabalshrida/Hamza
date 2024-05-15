const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  title: String,
  director: String,
  year: String,
  country: String,
  length: Number,
  genre: String,
  colour: String,
  isFav: Boolean,
  overview: String,
  vote_count: Number,
  vote_average: Number,
});

const MovieModel = mongoose.model("Movie", movieSchema);

module.exports = { MovieModel };
