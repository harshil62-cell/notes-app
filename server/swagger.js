const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes App API',
      version: '1.0.0',
      description: 'API documentation for Notes App',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
      {
        url: 'https://notes-app-825n.onrender.com',
      }
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };