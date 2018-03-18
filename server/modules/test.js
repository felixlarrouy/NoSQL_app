const mongodb = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://nosql_app:p4ssword@ds113849.mlab.com:13849/inspections_restaurant';

mongodb.MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db('inspections_restaurant');

  findCriterias(db, function() {
    client.close();
  });
});

const findCriterias = function(db, callback) {
  var criterias = {}

  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');

  collection.distinct("restaurant.borough", function(err, boroughs) {
    assert.equal(err, null);
    var boroughs_list = []
    for (var i = 0; i < boroughs.length; i++) {
      boroughs_list.push(boroughs[i])
    }
    criterias.boroughs = boroughs_list
    callback(boroughs)
  });

  collection.distinct("restaurant.cuisineType", function(err, cuisineTypes) {
    assert.equal(err, null);
    var types_list = []
    for (var i = 0; i < cuisineTypes.length; i++) {
      types_list.push(cuisineTypes[i])
    }
    criterias.cuisineTypes = types_list
    callback(cuisineTypes)
  });

  collection.distinct("violationCode", function(err, violationCodes) {
    assert.equal(err, null);
    var codes_list = []
    for (var i = 0; i < violationCodes.length; i++) {
      codes_list.push(violationCodes[i])
    }
    criterias.violationCodes = codes_list
    callback(violationCodes)
  });

  collection.distinct("grade", function(err, grades) {
    assert.equal(err, null);
    var grades_list = []
    for (var i = 0; i < grades.length; i++) {
      grades_list.push(grades[i])
    }
    criterias.grades = grades_list
    console.log(criterias);
    callback(grades)
  });
}
