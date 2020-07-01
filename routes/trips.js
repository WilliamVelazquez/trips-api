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
      const { start_time, end_time, city, page } = req.query;

      try {
        const trips = await tripsService.getTrips(start_time, end_time, city, page);

        res.status(200).json({
          data: trips,
          page: page || 1,
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

  router.post(
    '/',
    validationHandler(createTripSchema),
    async function(req, res, next) {
      const { body } = req;
      
      const creationDate = new Date();
      // Converting the Date for requesting with a String from Postman
      const trip = {
        ...body,
        start: {
          ...body.start,
          date: body.start.date ? new Date(body.start.date) : creationDate,
        },
        end: {
          ...body.end,
          date: body.end.date ? new Date(body.end.date) : null,
        },
        createdAt: creationDate,
        updatedAt: creationDate,
      }

      try {
        const createdTripId = await tripsService.createTrip(trip);

        res.status(201).json({
          data: createdTripId,
          message: 'trip created'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:tripId',
    validationHandler(idSchema, 'params'),
    validationHandler(updateTripSchema),
    async function(req, res, next) {
      const { tripId } = req.params;
      const { body } = req;
      
      const updateDate = new Date();
      
      const trip = {
        ...body,
        updatedAt: updateDate,
      }
      
      // Converting the Date for requesting with a String from Postman
      // if(body.start && body.start.date){
      //   trip.start = {
      //     ...body.start,
      //     date: new Date(body.start.date),
      //   }
      // }

      // if(body.end && body.end.date){
      //   trip.end = {
      //     ...body.end,
      //     date: new Date(body.end.date),
      //   }
      // }

      // console.log('tripUpdate--->', trip);

      try {
        const updatedTripId = await tripsService.updateTrip({
          tripId,
          trip
        });

        res.status(201).json({
          data: updatedTripId,
          message: 'trip updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:tripId',
    validationHandler(idSchema, 'params'),
    async function(req, res, next) {
      const { tripId } = req.params;

      try {
        const deletedTripId = await tripsService.deleteTrip(tripId);

        res.status(200).json({
          data: deletedTripId,
          message: 'trip deleted'
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = tripsApi;
