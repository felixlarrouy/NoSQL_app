const mongodb = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://nosql_app:p4ssword@ds113849.mlab.com:13849/inspections_restaurant';
var mongoClient = mongodb.MongoClient;
let db;


exports.connect = function(callback) {
  mongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database.db('inspections_restaurant');
    callback();
  })
}

exports.disconnect = function(callback) {
  db = null
  callback();
}

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

exports.findDocumentsQuery = function(criterias, callback) {

var matchDict = {}

Object.keys(criterias).forEach(function(element, key, _array) {
  if (element === 'criticalFlag' && criterias[element]) {
    matchDict.criticalFlag = "Critical"
  }

  if (element === 'score') {
    matchDict.score = {}
    matchDict.score.$gte = criterias.score.min
    matchDict.score.$lte = criterias.score.max
  }

  if (element === 'grade') {
    if (criterias.grade.length > 0) {
      matchDict.grade = {}
      matchDict.grade.$in = criterias.grade
    }
  }

  if (element === 'violationCode') {
    if (criterias.violationCode.length > 0) {
      matchDict.violationCode = {}
      matchDict.violationCode.$in = criterias.violationCode
    }
  }

  if (element === 'restaurant') {
    if (criterias.restaurant.borough != "") {
      matchDict["restaurant.borough"] = criterias.restaurant.borough
    }
    if (criterias.restaurant.cuisineType != "") {
      matchDict["restaurant.cuisineType"] = criterias.restaurant.cuisineType
    }
  }
})

console.log(matchDict);

const collection = db.collection('inspectionsRestaurant');
// Find some documents
collection.aggregate([{
    $match: matchDict
  },
  //{$unwind : "$restaurant"},
  {
    $group: {
      "_id": {
        id: "$idRestaurant",
        restaurant: "$restaurant"
      }
      // "Restaurant": {
      //   $push: "$$ROOT"
      // }
    }
  }
  //{$unwind : "$Restaurant"}
]).toArray(function(err, docs) {
  assert.equal(err, null);
  //Retour à la ligne pour distinguer les differents groupes de restaurant
  //console.log("\n\n Found the following records");
  //console.log(docs);
  var newDocs = []
  for (var i = 0; i < docs.length; i++) {
    var newDoc = {}
    newDoc.restaurant = docs[i]._id.restaurant
    newDoc.restaurant.id = docs[i]._id.id
    newDocs.push(newDoc.restaurant)
  }
  return callback(null, newDocs)
});
}

exports.findInspections = function(id, callback) {
    const collection = db.collection('inspectionsRestaurant');
    // Find some documents
    collection.aggregate([{
        $match: {
          "idRestaurant": parseInt(id)
        }
      },
      {
        $project: {
          "restaurant": 0,
          "_id": 0,
          "idRestaurant": 0
        }
      }
    ]).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log(docs);
      return callback(null, docs)
    });
}

exports.getDocuments = function() {
  return new Promise(function(resolve, reject) {
      findDocumentsQuery(db, function(err, docs) {
        if (err) reject(err)
        resolve(docs)
      });
    });
}

exports.doRequest = function(type, query, projection, callback) {
    const collection = db.collection('inspectionsRestaurant');
    switch (type) {
      case "find":
        collection.find(JSON.parse(query), JSON.parse(projection)).toArray(function(err, docs) {
          if (err) callback(err);
          console.log("Found the following records");
          console.log(docs)
          callback(null, docs);

        });
        break;
      case "aggregate":
        console.log(query);
        collection.aggregate(JSON.parse(query)).toArray(function(error, docs) {
          if (error) callback(error);
          console.log("Found the following records");
          console.log(docs)
          callback(null, docs)
        });
        break;
      case "distinct":

        collection.distinct(query, function(err, docs) {
          if (err) callback(err)
          console.log("\n\n Found the following records");
          console.log(docs)
          callback(null, docs);

        });
        break;
      default:
        collection.find({}).toArray(function(err, docs) {
          if (err) callback(err)
          console.log("Found the following records");
          console.log(docs)
          if (err) callback(err);
          callback(null, docs);

        });
        break;
    }
}

exports.updateDocument = function(location) {
  return new Promise(function(resolve, reject) {
      const collection = db.collection('inspectionsRestaurant');
      collection.updateOne({
        _id: location[0]
      }, {
        $set: {
          "latitude": location[2],
          "longitude": location[3]
        }
      }, function(err, result) {
        if (err) reject(err);
        resolve(result);
      });
    })
}

exports.getCriterias = (callback) => {
  json_criterias = {}
  findBoroughs(json_criterias, function() {
    findCuisineType(json_criterias, function() {
      findViolationCodes(json_criterias, function() {
        findGrades(json_criterias, function() {
          return callback(null, json_criterias)
        })
      })
    })
  })
}

const findBoroughs = function(json_criterias, callback) {
  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');
  // Find some documents
  collection.distinct("restaurant.borough", function(err, boroughs) {
    assert.equal(err, null);
    var boroughs_list = []
    for (var i = 0; i < boroughs.length; i++) {
      boroughs_list.push(boroughs[i])
    }
    json_criterias.boroughs = boroughs_list
    callback(boroughs)
  });
}

const findCuisineType = function(json_criterias, callback) {
  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');
  // Find some documents
  collection.distinct("restaurant.cuisineType", function(err, cuisineTypes) {
    assert.equal(err, null);
    var types_list = []
    for (var i = 0; i < cuisineTypes.length; i++) {
      types_list.push(cuisineTypes[i])
    }
    json_criterias.cuisineTypes = types_list
    callback(cuisineTypes)
  });
}

const findViolationCodes = function(json_criterias, callback) {
  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');
  // Find some documents
  collection.distinct("violationCode", function(err, violationCodes) {
    assert.equal(err, null);
    var codes_list = []
    for (var i = 0; i < violationCodes.length; i++) {
      codes_list.push(violationCodes[i])
    }
    json_criterias.violationCodes = codes_list
    callback(violationCodes)
  });
}

const findGrades = function(json_criterias, callback) {
  // Get the documents collection
  const collection = db.collection('inspectionsRestaurant');
  // Find some documents
  collection.distinct("grade", function(err, grades) {
    assert.equal(err, null);
    var grades_list = []
    for (var i = 0; i < grades.length; i++) {
      grades_list.push(grades[i])
    }
    json_criterias.grades = grades_list
    callback(grades)
  });
}
