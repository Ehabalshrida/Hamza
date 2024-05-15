const swaggerJSDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movies API",
      version: "1.0.0",
      description: "API documentation for Hamza Node.js application",
    },
  },
  accept: "application/json",
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerSpec };
