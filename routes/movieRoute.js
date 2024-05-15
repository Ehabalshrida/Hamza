const express = require("express");
const {
  populateMovies,
  createMovie,
  moviesList,
  updateMovie,
  findMovieById,
  deleteMovie,
  searchMovies,
  moviesPerPage,
  filterMoviesBasedgenre,
  markAsFavorite,
} = require("../controllers/movieController.js");
const { cacheMiddleware } = require("../cache/cache.js");
const router = express.Router();

/**
 * @swagger
 * /movies/add-fav/{id}:
 *   put:
 *     summary: Mark movie as favorite
 *     description: Mark a movie as favorite by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the movie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie marked as favorite successfully.
 */
router.put("/add-fav/:id", markAsFavorite);

// movies-genre can be removed since it can be handle through search-movies
/**
 * @swagger
 * /movies/movies-genre:
 *   get:
 *     summary: Filter movies based on genre
 *     description: Retrieve a list of movies based on the specified genre.
 *     parameters:
 *       - in: query
 *         name: genre
 *         description: Genre of the movie
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of movies per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of movies filtered by genre.
 */
router.get("/movies-genre", cacheMiddleware, filterMoviesBasedgenre);

/**
 * @swagger
 * /movies/movies-per-page:
 *   get:
 *     summary: Get movies per page
 *     description: Retrieve a list of movies with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of movies per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of movies per page.
 */
router.get("/movies-per-page", cacheMiddleware, moviesPerPage);

/**
 * @swagger
 * /movies/search-movies:
 *   get:
 *     summary: Search movies
 *     description: Search for movies based on various criteria.
 *     parameters:
 *       - in: query
 *         name: title
 *         description: Title of the movie
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: director
 *         description: Director of the movie
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         description: Year of the movie
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: country
 *         description: Country of the movie
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         description: Genre of the movie
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of movies per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of movies matching the search criteria.
 */
router.get("/search-movies", cacheMiddleware, searchMovies);

/**
 * @swagger
 * /movies/delete-movie/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Delete a movie from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the movie to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *       404:
 *         description: Movie not found with the provided ID.
 */
router.delete("/delete-movie/:id", deleteMovie);

/**
 * @swagger
 * /movies/update-movie/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Update a movie in the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the movie to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: number
 *               country:
 *                 type: string
 *               length:
 *                 type: number
 *               genre:
 *                 type: string
 *               colour:
 *                 type: string
 *     responses:
 *       204:
 *         description: Movie updated successfully.
 *       404:
 *         description: Movie not found with the provided ID.
 */
router.put("/update-movie/:id", updateMovie);

/**
 * @swagger
 * /movies/find-movie/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a movie from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the movie to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie retrieved successfully.
 *       404:
 *         description: Movie not found with the provided ID.
 */
router.get("/find-movie/:id", findMovieById);

/**
 * @swagger
 * /movies/create-movie:
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie record in the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required:
 *               director:
 *                 type: string
 *               year:
 *                 type: number
 *               country:
 *                 type: string
 *               length:
 *                 type: number
 *               genre:
 *                 type: string
 *               colour:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully.
 *       409:
 *         description: Failed to create movie due to a conflict.
 */
router.post("/create-movie", createMovie);

/**
 * @swagger
 * /movies/list-movies:
 *   get:
 *     summary: Get list of movies
 *     description: Retrieve a list of all movies from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of movies.
 *         content:
             application/json:
 *       404:
 *         description: Failed to retrieve movies due to not found.
 */
router.get("/list-movies", cacheMiddleware, moviesList);

// use to populate data base
/**
 * @swagger
 * /movies/populate-movies-database:
 *   get:
 *     summary: Populate Database with movies
 *     description: Populate the database with predefined movies.
 *     responses:
 *       200:
 *         description: Successful response indicating that movies were added to the database.
 *       500:
 *         description: Failed to populate movies due to an internal server error.
 */
router.get("/populate-movies-database", populateMovies);

module.exports = { router };

/*

router.put('/add-fav/:id', markAsFavorite);
router.get('/movies-genre', filterMoviesBasedgenre);
router.get('/movies-page', cacheMiddleware, moviesPerPage);
router.get('/search-movies', cacheMiddleware, searchMovies);
router.delete('/delete-movie/:id', deleteMovie);
router.get('/find-movie/:id',cacheMiddleware, findMovieById);
router.put('/update-movie/:id', updateMovie);
router.post('/create-movie', createMovie);
router.get('/list-movies', moviesList);
// use to populate data base 
router.get('/populate-movies', populateMovies); */
