const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const { config } = require('./config');
const corsOptions = { origin: config.corsOrigin };

const tripsApi = require('./routes/trips');
const swaggerDocs = require('./routes/docs');
const notFoundHandler = require('./utils/middleware/notFoundHandler');
const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers');

// Security
app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());

// Routes
tripsApi(app);
swaggerDocs(app);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function(){
  if(config.dev) console.log('Development environment');
  console.log(`Listening http://localhost:${config.port}`);
});
