const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const locations = require('./modules/locations')
const mongodb = require('./modules/mongodb')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

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




router.get('/connect', (req, res) => {
  mongodb.connect(function() {
    console.log("Connected to the database");
    mongodb.getCriterias((err, criterias) => {
      res.json(criterias);
    })
  });
})

router.get('/disconnect', (req, res) => {
  mongodb.disconnect(function() {
    console.log("Disconnected from the database");
    res.status(status.ok).send("Disconnected")
  });
})

router.get('/inspections/:id', (req, res) => {
  if (!req.params.id) {
    res.status(status.badRequest).send({
      'error': 'Wrong params request'
    });
  }
  mongodb.findInspections(req.params.id, (err, inspections) => {
    if (err) {
      res.status(status.badRequest).send({
        'error': err.message
      });
    } else {
      res.status(status.ok).send(inspections);
    }
    res.end();
  });
})

router.post('/query', (req, res) => {
  console.log("Body :" + JSON.stringify(req.body))
  mongodb.findDocumentsQuery(req.body, (err, results) => {
    res.json(results);
  })
})

router.get('/dev/:type/:query/:projection', (req, res) => {
  if (!req.params.type || !req.params.query || !req.params.projection) {
    res.status(status.badRequest).send({
      'error': 'Wrong params request'
    });
  }
  mongodb.doRequest(req.params.type, req.params.query, req.params.projection, (err, data) => {
    if (err) {
      res.status(status.badRequest).send({
        'error': err.message
      });
    } else {
      res.status(status.ok).send(data);
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
