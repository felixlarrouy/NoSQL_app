const request = require('request')
const mongodb = require('./mongodb')
const pMap = require('p-map');
const pReflect = require('p-reflect');

exports.getLocations = (callback) => {
  mongodb.getDocuments().then((docs) => {

    let promises = []
    for (var i = 0; i < docs.length; i++) {
      promises.push(locate(docs[i]._id, "https://maps.googleapis.com/maps/api/geocode/json?address=" + docs[i].restaurant.buildingnum + "+" + docs[i].restaurant.street + "+" +
        docs[i].restaurant.borough + "&key=AIzaSyD0XB3hdvsrJnTEjRawEJdismD34dKq8Js"))
    }
    return pMap(promises,pReflect, {concurrency: 1})
  }).then(results => {
    let promises_loc = []
    let locations = status.filter(x => x.isFulfilled).map(x => x.value);

    console.log(locations.length);
    for (var i = 0; i < locations.length; i++) {
      promises_loc.push(mongodb.updateDocument(locations[i]))
      if (i % 5 == 0) {
        console.log("Updated " + i + " documents.");
      }
    }
    return pMap(promises_loc, pReflect, {
      concurrency: 1
    })
  }).then(status => {
    let errors = status.filter(x => x.isRejected).map(x => x.value);
    let values = status.filter(x => x.isFulfilled).map(x => x.value);
    console.log("Errors: " + errors.length + " Values : " + values.length)
    return callback(null, status)
  }).catch(error => {
    return callback(error)
  })
}

function locate(_id, url) {
  return new Promise(function(resolve, reject) {
    request({
      uri: url
    }, function(err, resp, body) {
      if (err) reject(err)

      var apiResponse = JSON.parse(body);
      if(apiResponse.results.length === 0 || typeof apiResponse.results[0] === 'undefined') {
        console.log("rejected " +_id);
        let err = new Error("Couldn't find location")
        return reject(err)
      }
      console.log(_id);
      resolve([_id, apiResponse.results[0].formatted_address, apiResponse.results[0].geometry.location.lat,
        apiResponse.results[0].geometry.location.lng
      ])
    })
  })
}
