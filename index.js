const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./routes/swager.js");
const cors = require("cors");
require("dotenv").config();

const { router } = require("./routes/movieRoute.js");

const PORT = process.env.PORT;
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/movies", router);
app.use(cors());

const CONNECTION_URL = process.env.CONNECTION_URL;
mongoose
    .connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server Running on : http://localhost:${PORT}/api-docs`)))
    .catch(error => console.log(`did not connect`));
