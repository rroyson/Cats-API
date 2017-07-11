const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

//  C - create (POST) a single cat
//  R - read (GET)  a single cat
//  U - update (PUT) a single cat
//  D - delete (DELETE) a single cat
//  L - list (GET) all the cats

//   CREATE  - POST /cats

app.get('/', function(req, res, next) {
  res.send('Welcome to the Cats API')
})

app.post('/cats', function(req, res, next) {
  console.log('POST /cats, req.body: ', req.body)

  dal.addCat(req.body, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(data)
  })
})

//   READ -    GET /cats/:id

app.get('/cats/:id', function(req, res, next) {
  dal.getCat(Number(req.params.id), function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))

    if (data) {
      res.status(200).send(data)
    } else {
      next(new HTTPError(404, 'Not Found', { path: req.path }))
    }
  })
})

//   UPDATE -  PUT /cats/:id
//get data, find cats/:id, replace with new data
app.put('/cats/:id', function(req, res, next) {
  const catId = req.params.id
  console.log('cat id', catId)

  dal.updateCat(Number(catId), req.body, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

//   DELETE -  DELETE /cats/:id

app.delete('/cats/:id', function(req, res, next) {
  const catId = req.params.id

  dal.deleteCat(Number(catId), function(err, data) {
    console.log('data', JSON.stringify(data, null, 2))
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

//   LIST   -  GET /cats

app.get('/cats', function(req, res, next) {
  dal.listCats(function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// ERROR MIDDLEWARE

app.use(function(err, req, res, next) {
  console.log(req.method, ' ', req.path, ' ', 'error: ', err)
  res.status(err.status || 500)
  res.send(err)
  res.end()
})

app.listen(port, () => console.log('API is running on port: ', port))
