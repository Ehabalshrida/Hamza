const {
  moviesList,
  createMovie,
  findMovieById,
  updateMovie,
  deleteMovie,
  markAsFavorite,
} = require("../controllers/movieController.js");
const { MovieModel } = require("../models/movieModel.js");

jest.mock("../models/movieModel");
jest.mock("../services/IMDBService");

describe("moviesList controller", () => {
  it("should return list of movies with status 200", async () => {
    const mockMovies = [{ title: "Movie 1" }, { title: "Movie 2" }];
    jest.spyOn(MovieModel, "find").mockResolvedValue(mockMovies);

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await moviesList({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockMovies);
  });

  it("should return 404 with error message if MovieModel.find throws error", async () => {
    const mockError = new Error("Internal server error");
    jest.spyOn(MovieModel, "find").mockRejectedValue(mockError);

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await moviesList({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: mockError.message,
    });
  });
});
describe("createMovie controller", () => {
  it("should create a new movie successfully", async () => {
    const req = {
      body: {
        title: "Test Movie",
        director: "Test Director",
        year: 2022,
        country: "Test Country",
        length: 120,
        genre: "Test Genre",
        colour: "Test Colour",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(),
    };

    MovieModel.mockReturnValueOnce({
      save: jest.fn().mockResolvedValue(req.body),
    });

    await createMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(201); 
    expect(res.json).toHaveBeenCalledWith(req.body);
  });
  it("should fail to create a movie due to a conflict", async () => {
    const req = {
      body: {
        title: "Test Movie",
        director: "Test Director",
        year: 2022,
        country: "Test Country",
        length: 120,
        genre: "Test Genre",
        colour: "Test Colour",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    MovieModel.mockReturnValueOnce({
      save: jest.fn().mockRejectedValue(new Error("Database conflict")),
    });

    await createMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Database conflict" });
  });
});
describe("findMovieById controller", () => {
  it("should retrieve a movie by ID successfully", async () => {
    const req = {
      params: {
        id: "123456789012345678901234",
      },
    };
    const mockMovie = {
      _id: "123456789012345678901234",
      title: "Test Movie",
      director: "Test Director",
      year: 2022,
      country: "Test Country",
      length: 120,
      genre: "Test Genre",
      colour: "Test Colour",
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      send: jest.fn(),
    };

    MovieModel.findById.mockResolvedValueOnce(mockMovie);

    await findMovieById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockMovie);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
describe("deleteMovie controller", () => {
  it("should delete a movie successfully", async () => {
    const req = {
      params: {
        id: "123456789012345678901234",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    const deletedMovie = {
      _id: req.params.id,
      title: "Deleted Movie Title",
      director: "Deleted Director",
      year: 2022,
    };

    MovieModel.findByIdAndDelete.mockResolvedValueOnce(deletedMovie);

    await deleteMovie(req, res);

    expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith(req.params.id); 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(deletedMovie);
  });

  it("should return 404 if no movie is found with the provided ID", async () => {
    const req = {
      params: {
        id: "123456789012345678901234",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    MovieModel.findByIdAndDelete.mockResolvedValueOnce(null);

    await deleteMovie(req, res);

    expect(MovieModel.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(`No Movie with id: ${req.params.id}`);
    expect(res.json).not.toHaveBeenCalled();
  });
});
describe("markAsFavorite controller", () => {
  
  it("should return 404 if movie is not found", async () => {
   
    const req = { params: { id: "nonExistingMovieId" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    MovieModel.findById.mockResolvedValue(null);

    await markAsFavorite(req, res);

    expect(MovieModel.findById).toHaveBeenCalledWith("nonExistingMovieId");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("No Movie with id: nonExistingMovieId");
  });

  it("should handle internal server error", async () => {
    const req = { params: { id: "movieId123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = "Internal server error";
    MovieModel.findById.mockRejectedValueOnce(new Error(errorMessage));

    await markAsFavorite(req, res);

    expect(MovieModel.findById).toHaveBeenCalledWith("movieId123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
describe('updateMovie function', () => {
  it('should update a movie and return the updated movie', async () => {
    const req = {
      params: { id: 'movie_id' },
      body: { title: 'Updated Title', genre: 'Updated Genre' }
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    const updatedMovie = { _id: 'movie_id', title: 'Updated Title', genre: 'Updated Genre' };
    MovieModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(updatedMovie);

    await updateMovie(req, res);

    expect(MovieModel.findByIdAndUpdate).toHaveBeenCalledWith('movie_id', {
      _id: 'movie_id',
      title: 'Updated Title',
      genre: 'Updated Genre'
    }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedMovie);
  });

  it('should return 404 if no movie with the given id is found', async () => {
    const req = {
      params: { id: 'non_existing_id' },
      body: { title: 'Updated Title', genre: 'Updated Genre' }
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn()
    };

    MovieModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null);

    await updateMovie(req, res);

    expect(MovieModel.findByIdAndUpdate).toHaveBeenCalledWith('non_existing_id', {
      _id: 'non_existing_id',
      title: 'Updated Title',
      genre: 'Updated Genre'
    }, { new: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('No Movie with id: non_existing_id');
  });
});
