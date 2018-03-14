const request = require('request')

//TODO: parcourir chaque document de la base de données
// créer un tableau de locations avec chaque element du type ["nom du resto", latitude, longitude, "addresse" (balise "formatted_address"
//                                                                                                                dans le document json)]

var locations = []

// A faire pour chaque document JSON dans la base de données
url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + restaurant.buildingnum + "+" + restaurant.street + "+"
                                                                    + restaurant.borough + "&key=AIzaSyD0XB3hdvsrJnTEjRawEJdismD34dKq8Js"
request({
  uri: url
}, function(err, resp, body) {
  if(err) return console.log(err);

  var apiResponse = JSON.parse(body);
  locations.push([restaurant.name, apiResponse.results.formatted_address, apiResponse.geometry.location.lat, apiResponse.geometry.location.lng])
})
