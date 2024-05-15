const { MovieModel } = require('../models/movieModel.js')
const moviesData = require('../demo_data/data.json')
const { getInternetMovieDetails } = require('../services/IMDBService.js')

const markAsFavorite = async (req, res) => {
    const { id } = req.params
    try {
        const movie = await MovieModel.findById(id)
        if (!movie) {
            return res.status(404).send(`No Movie with id: ${id}`)
        }
        const { overview, vote_count, vote_average } =
            await getInternetMovieDetails(movie.title)
        movie.isFav = true
        movie.vote_average = vote_average
        movie.vote_count = vote_count
        movie.overview = overview
        movie.save()
        const updatedMovie = await MovieModel.findByIdAndUpdate(id, movie, {
            new: true,
        })
        res.status(200).json(updatedMovie)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const filterMoviesBasedgenre = async (req, res) => {
    try {
        const { genre, page = 1, limit = 10 } = req.query
        const query = {}

        if (genre) query.genre = { $regex: genre, $options: 'i' }

        const skip = (page - 1) * limit

        const movies = await MovieModel.find(query)
            .skip(skip)
            .limit(parseInt(limit))

        const totalMovies = await MovieModel.countDocuments(query)

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalMovies / limit),
            totalMovies,
            movies,
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const moviesPerPage = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        const moviesList = await MovieModel.find()
            .skip(skip)
            .limit(parseInt(limit))

        const totalMovies = await MovieModel.countDocuments()

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalMovies / limit),
            totalMovies,
            movies: moviesList,
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const searchMovies = async (req, res) => {
    try {
        const {
            title,
            director,
            year,
            country,
            genre,
            page = 1,
            limit = 10,
        } = req.query
        const query = {}

        if (title) query.title = { $regex: title, $options: 'i' }
        if (director) query.director = { $regex: director, $options: 'i' }
        if (year) query.year = year
        if (country) query.country = { $regex: country, $options: 'i' }
        if (genre) query.genre = { $regex: genre, $options: 'i' }

        const skip = (page - 1) * limit

        const movies = await MovieModel.find(query)
            .skip(skip)
            .limit(parseInt(limit))

        const totalMovies = await MovieModel.countDocuments(query)

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalMovies / limit),
            totalMovies,
            movies,
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const deleteMovie = async (req, res) => {
    const { id } = req.params
    const deletedMovie = await MovieModel.findByIdAndDelete(id)
    deletedMovie
        ? res.status(200).json(deletedMovie)
        : res.status(404).send(`No Movie with id: ${id}`)
}

const updateMovie = async (req, res) => {
    const { id } = req.params
    const movie = { ...req.body, _id: id }
    const updatedMovie = await MovieModel.findByIdAndUpdate(id, movie, {
        new: true,
    })
    updatedMovie
        ? res.status(200).json(updatedMovie)
        : res.status(404).send(`No Movie with id: ${id}`)
}

const findMovieById = async (req, res) => {
    const { id } = req.params

    const movie = await MovieModel.findById(id)

    movie ? res.json(movie) : res.status(404).send(`No Movie with id: ${id}`)
}

const moviesList = async (req, res) => {
    try {
        const moviesList = await MovieModel.find()
        res.status(200).json(moviesList)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const createMovie = async (req, res) => {
    const movieRecord = new MovieModel(req.body)

    try {
        const movieCreated = await movieRecord.save()

        res.status(201).json(movieCreated)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

// use to populate data base
const populateMovies = async () => {
    try {
        for (const movieData of moviesData) {
            const movie = new MovieModel(movieData)
            await movie.save()
        }
        console.log('All movies added successfully')
    } catch (error) {
        console.error('Error populating movies:', error)
    }
}
module.exports = {
    populateMovies,
    createMovie,
    moviesList,
    findMovieById,
    updateMovie,
    deleteMovie,
    searchMovies,
    moviesPerPage,
    filterMoviesBasedgenre,
    markAsFavorite,
}
