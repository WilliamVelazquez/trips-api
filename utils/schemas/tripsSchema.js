const joi = require('@hapi/joi');

const tripIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const dateTimeSchema = joi.date().iso();
const pickupAddressSchema = joi.string();
const typeSchema = joi.string().valid('Point');
const coordinatesSchema = joi.array();
const countryNameSchema = joi.string();
const cityNameSchema = joi.string();
const firstNameSchema = joi.string();
const lastNameSchema = joi.string();
const plateSchema = joi.string().min(6).max(6);
const statusSchema = joi.string().valid('started', 'near', 'onWay');
const checkCodeSchema = joi.string().min(1).max(3);
const priceSchema = joi.number();

const idSchema = {
  tripId: tripIdSchema.required(),
};

const createTripSchema = {
  start: {
    date: dateTimeSchema.required(),
    pickup_address: pickupAddressSchema.required(),
    pickup_location: {
      type: typeSchema.required(),
      coordinates: coordinatesSchema.required(),
    }
  },
  end: {
    date: dateTimeSchema.required(),
    pickup_address: pickupAddressSchema.required(),
    pickup_location: {
      type: typeSchema.required(),
      coordinates: coordinatesSchema.required(),
    }
  },
  country: {
    name: countryNameSchema.required(),
  },
  city: {
    name: cityNameSchema.required(),
  },
  passenger: {
    first_name: firstNameSchema.required(),
    last_name: lastNameSchema.required(),
  },
  driver: {
    first_name: firstNameSchema.required(),
    last_name: lastNameSchema.required(),
  },
  car: {
    plate: plateSchema.required(),
  },
  status: statusSchema.required(),
  check_code: checkCodeSchema.required(),
  createdAt: dateTimeSchema.required(),
  updatedAt: dateTimeSchema.required(),
  price: priceSchema.required(),
  driver_location: {
    type: typeSchema.required(),
    coordinates: coordinatesSchema.required(),
  },
};

const updateTripSchema = {
  start: {
    pickup_address: pickupAddressSchema,
    pickup_location: {
      type: typeSchema,
      coordinates: coordinatesSchema,
    }
  },
  car: {
    plate: plateSchema,
  },
  status: statusSchema,
  check_code: checkCodeSchema,
  updatedAt: dateTimeSchema,
  price: priceSchema,
  driver_location: {
    type: typeSchema,
    coordinates: coordinatesSchema,
  },
};

module.exports = {
  idSchema,
  createTripSchema,
  updateTripSchema
};
