const mongodb = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://nosql_app:p4ssword@ds113849.mlab.com:13849/inspections_restaurant';

const findAllDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');
  // Find some documents
  collection.find({}).limit(5000).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    if (err) callback(err);
    callback(null, docs);
  });
}

const findDocumentsQuery = function(db, callback) {
  //Simulate what i should receive
  var Dictionnary = {"restaurant.borough":"MANHATTAN", "restaurant.cuisineType": "Italian"};

  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');

  // Find some documents
  collection.aggregate([
    {$match: Dictionnary},
    //{$unwind : "$restaurant"},
    {$group: {"_id": "$idRestaurant", "Restaurant":{$push:"$$ROOT"}}},
    //{$unwind : "$Restaurant"}
  ]).each(function(err, docs) {
    assert.equal(err, null);

    //Retour à la ligne pour distinguer les differents groupes de restaurant
    console.log("\n\n Found the following records");
    console.log(docs);
    callback(docs);
  });
}

exports.getDocuments = function() {
  return new Promise(function(resolve, reject) {
    // Use connect method to connect to the server
    mongodb.MongoClient.connect(url, function(err, client) {
      if (err) reject(err);
      console.log("Connected successfully to server");

      const db = client.db('inspections_restaurant');

      findDocumentsQuery(db, function(err, docs) {
        if (err) reject(err)
        resolve(docs)
        client.close();
      });
    });
  })
}

exports.updateDocument = function(location) {
  return new Promise(function(resolve, reject) {
    mongodb.MongoClient.connect(url, function(err, client) {
      if (err) reject(err);

      const db = client.db('inspections_restaurant');
      const collection = db.collection('inspectionsRestaurant');
      collection.updateOne({_id : location[0]}
        , { $set: { "latitude": location[2], "longitude": location[3] } }, function(err, result) {
          if(err) reject(err);
          resolve(result);
          client.close();
      });
    })
  })
}
