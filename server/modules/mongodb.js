const mongodb = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://nosql_app:p4ssword@ds113849.mlab.com:13849/inspections_restaurant';

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');
  // Find some documents
  collection.find({}).limit(5).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    if(err) callback(err);
    callback(null, docs);
  });
}

exports.getDocuments = function() {
  return new Promise(function(resolve, reject) {
    // Use connect method to connect to the server
    mongodb.MongoClient.connect(url, function(err, client) {
      if (err) throw err;
      console.log("Connected successfully to server");

      const db = client.db('inspections_restaurant');

      findDocuments(db, function(err, docs) {
        if(err) reject(err)
        resolve(docs)
        client.close();
      });
    });
  })
}
