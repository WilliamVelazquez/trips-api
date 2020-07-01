const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');

function swaggerDocs(app) {
  const options = {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css',
  };
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));
}

module.exports = swaggerDocs;
