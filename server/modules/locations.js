const request = require('request')
const mongodb = require('./mongodb')

//TODO: parcourir chaque document de la base de données
// créer un tableau de locations avec chaque element du type ["nom du resto", latitude, longitude, "addresse" (balise "formatted_address"
//                                                                                                                dans le document json)]

exports.getLocations = (callback) => {
  mongodb.getDocuments().then((docs) => {

    let promises = []
    for (var i = 0; i < docs.length; i++) {
      promises.push(locate("https://maps.googleapis.com/maps/api/geocode/json?address=" + docs[i].restaurant.buildingnum + "+" + docs[i].restaurant.street + "+" +
        docs[i].restaurant.borough + "&key=AIzaSyD0XB3hdvsrJnTEjRawEJdismD34dKq8Js"))
    }
    return Promise.all(promises)
  }).then(locations =>{
    return callback(null, locations)
  }).catch(error => {
    return callback(error)
  })
}

function locate(url){
  return new Promise(function(resolve,reject){
    request({
      uri: url
    }, function(err, resp, body) {
      if (err) reject(err)

      var apiResponse = JSON.parse(body);
      resolve([apiResponse.results[0].formatted_address, apiResponse.results[0].geometry.location.lat,
                        apiResponse.results[0].geometry.location.lng])
    })
  })
}
