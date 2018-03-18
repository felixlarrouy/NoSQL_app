const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const locations = require('./modules/locations')
const mongodb = require('./modules/mongodb')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const router = express.Router()

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
app.use(staticFiles)

const status = {
  'ok': 200,
  'created': 201,
  'noContent': 204,
  'notModified': 304,
  'badRequest': 400,
  'unauthorised': 401,
  'notFound': 404
};

router.get('/cities', (req, res) => {
  console.log(`reading this from env > ${process.env.MY_VARIABLE}`)
  const cities = [
    {name: 'New York City', population: 8175133},
    {name: 'Los Angeles',   population: 3792621},
    {name: 'Chicago',       population: 2695598}
  ]
  res.json(cities)
})

router.get('/locations', (req, res) => {
  locations.getLocations((err,locations) => {
    console.log(locations.length)
    res.json(locations)
  })
})

router.get('/dev/:type/:query/:projection', (req, res) => {
  console.log(req.params.query)
  if (!req.params.type || !req.params.query || !req.params.projection) {
    res.send(status.badRequest, {
      'error': 'Wrong params request'
    });
  }
  mongodb.doRequest(req.params.type,req.params.query, req.params.projection, (err, data) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'GET');
    if (err) {
      res.send(status.badRequest, {
        'error': err.message
      });
    } else {
      // res.json(data)
      res.send(status.ok, data);
    }
    res.end();
  });

})

app.use(router)

// any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
