# Movie API Project

_Its REST API project support caching mechanism to reduce the number of DB and integration API calls. and uses mongoAtas which is a fully managed cloud database service to host the mongo database of this project._

## Project Structure

MovieAPI/
│
├── models/
│ └── movieModel.js # Mongoose schema and model for Movie
│
├── routes/
│ ├── movieRoute.js # Express router for movie endpoints
│ └── swagger.js # Swagger documentation setup
│
├── controllers/
│ └── movieController.js # Controller for handling movie logic
│
├── cache/
│ └── cache.js # cache requests
│
├── .env # Environment variables
├── index.js # Main application file
├── package.json # Project metadata and dependencies
└── README.md # Project documentation

## Prerequisites

### Ensure you have the one of following installed on your machine:

- Node v20
- or docker desktop

## Setup Process

1- Clone the Repository

2- Navigate to the Root of the Project
Ensure you are in the root directory of the project:

3- Create .env file in root directory of the project and past inside it the variables in .env.sample file

4- If you have Node v20 you have to:

> note: you can skip this step if you want to use docker

- Install Dependencies using:
  > npm i
- run command:
  > npm run start

5- If you have docker desktop no need to do step 2, you have to type these commmands:

> npm run build

> npm run docker

6- Go to browser then past this url:
http://localhost:8080/api-docs
