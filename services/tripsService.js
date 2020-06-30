const MongoLib = require('../lib/mongo');
const { getInitialCurrentDate, getlastDateAfterDays } = require('../utils/utilities');
// const { tripsMock, filteredTripsMock, TripsServiceMock } = require('../utils/mocks/tripsMock');

class TripsService {
	constructor (){
    this.collection = 'trips';
    this.mongoDB = new MongoLib();
	}

  async countTrips(city) {
    const query = city ? { city: { name: city } } : null;
		const count = await this.mongoDB.count(this.collection, query);
		return count || 0;
  }
  
	async getTrips(start_time = '', end_time = '', city = '') {
		const start = start_time || getInitialCurrentDate();
		const end = end_time || getlastDateAfterDays();

		const query = (start && end) && { createdAt: { $gt: new Date(start), $lt: new Date(end) } };
		if(city) query.city={ name: city };
    
    const trips = await this.mongoDB.getAll(this.collection, query);
		return trips || [];
	}

	async getTrip(tripId) {
		// const trip = await Promise.resolve(TripsServiceMock.createTrip());
		const trip = await this.mongoDB.get(this.collection, tripId);
		return trip || {};
  }

  async createTrip(trip) {
		// const createdTripId = await Promise.resolve(TripsServiceMock.createTrip);
		const createdTripId = await this.mongoDB.create(this.collection, trip);
		return createdTripId;
	}

	async updateTrip({ tripId, trip } = {}) {
    const updatedTripId = await this.mongoDB.update(
      this.collection,
      tripId,
      trip
    );
    return updatedTripId;
	}

	async deleteTrip(tripId) {
    const deletedTripId = await this.mongoDB.delete(this.collection, tripId);
    return deletedTripId;
	}
}

module.exports = TripsService;
