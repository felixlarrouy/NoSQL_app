const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const locations = require('./modules/locations');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();

const staticFiles = express.static(path.join(__dirname, '../client/build'));
app.use(staticFiles);

router.get('/cities', (req, res) => {
  console.log(`reading this from env > ${process.env.MY_VARIABLE}`);
  const cities = [{ name: 'New York City', population: 8175133 }, { name: 'Los Angeles', population: 3792621 }, { name: 'Chicago', population: 2695598 }];
  res.json(cities);
});

router.get('/locations', (req, res) => {
  locations.getLocations((err, locations) => {
    console.log(locations.length);
    res.json(locations);
  });
});

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles);

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});