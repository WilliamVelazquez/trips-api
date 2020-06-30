const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const HOST = config.dbHost;
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${HOST}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = DB_NAME;
  }

  connect() {
    // console.log('MONGO_URI-->',MONGO_URI);
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }
          resolve(this.client.db(this.dbName));
          console.log('Connected succesfully to mongo');
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query, page = 1) {
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query)
        .skip(skip)
        .limit(PAGE_SIZE)
        .toArray();
    });
  }

  get(collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  count(collection, query = {}) {
    return this.connect().then(db => {
      return db.collection(collection).countDocuments(query);
    });
  }

  create(collection, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertOne(data);
      })
      .then(result => result.insertedId);
  }
  
  seed(collection, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertMany(data);
      })
      .then(result => result);
  }

  update(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then(db => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;
