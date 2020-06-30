const MongoLib = require('../lib/mongo');
const { getInitialCurrentDate, getlastDateAfterDays } = require('../utils/utilities');
// const { tripsMock, filteredTripsMock, TripsServiceMock } = require('../utils/mocks/tripsMock');

class TripsService {
	constructor (){
    this.collection = 'trips';
    this.mongoDB = new MongoLib();
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
  
  async countTrips(city) {
    const query = city ? { city: { name: city } } : null;
		const count = await this.mongoDB.count(this.collection, query);
		return count || 0;
  }
}

module.exports = TripsService;