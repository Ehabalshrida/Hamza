const axios = require("axios");
require("dotenv").config();
const baseURL = process.env.API_URL;
const apiKey = process.env.API_KEY;
const readAccessToken = process.env.API_READ_ACCESSS_TOKEN;
const HTTP = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    common: {
      Accept: "application/json",
    },
    Authorization: `Bearer ${readAccessToken}`,
  },
  params: {
    api_key: apiKey,
  },
});

const getInternetMovieDetails = async (query) => {
  try {
    const response = await HTTP.get(`/search/movie`, {
      params: {
        query,
      },
    });
    return response.data.results[0];
  } catch (error) {
    console.error("Error fetching internet movie data:", error);
    throw error;
  }
};

module.exports = { getInternetMovieDetails };
