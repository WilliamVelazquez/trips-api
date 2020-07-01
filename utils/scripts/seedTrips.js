const chalk = require('chalk');
const debug = require('debug')('app:scripts:trips');
const MongoLib = require('../../lib/mongo');
const { tripsMock } = require('../../utils/mocks/tripsMock');

async function seedTrips() {
  try {
    const mongoDB = new MongoLib();

    const inserts = await mongoDB.seed('trips', tripsMock);
    // console.log('inserts--->', inserts.insertedIds);
    debug(chalk.green(`${inserts.insertedCount} trips have been created succesfully`)); // prettier-ignore
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedTrips();
