const express = require('express');
const TripsService = require('../services/tripsService');

const { idSchema, createTripSchema, updateTripSchema } = require('../utils/schemas/tripsSchema');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/utilities');

const validationHandler = require('../utils/middleware/validationHandler');
const cacheResponse = require('../utils/cacheResponse');

function tripsApi(app) {
  const router = express.Router();
  app.use('/api/trips', router);

  const tripsService = new TripsService();

  router.get(
    '/count',
    async function(req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { city } = req.query;

      try {
        const count = await tripsService.countTrips(city);
        res.status(200).json({
          data: count,
          message: 'trips counted'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/',
    async function(req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { start_time, end_time, city } = req.query;

      try {
        const trips = await tripsService.getTrips(start_time, end_time, city);

        res.status(200).json({
          data: trips,
          message: 'trips listed'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/:tripId',
    validationHandler(idSchema, 'params'),
    async function(req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { tripId } = req.params;

      try {
        const trip = await tripsService.getTrip(tripId);

        res.status(200).json({
          data: trip,
          message: 'trip retrieved'
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = tripsApi;
