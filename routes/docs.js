const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');

function swaggerDocs(app) {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

module.exports = swaggerDocs;
