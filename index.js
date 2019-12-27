/* eslint-disable linebreak-style */
/* eslint-disable semi */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Person = require('./models/person')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())


const morgan = require('morgan')
morgan.token('data', function (req, res, next) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms  :data')
)


app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(response => {
    res.json(response.map(p => p.toJSON()))
  })
    .catch(error => next(error))

})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({}).then(response => {
    res.status(200).send(`Phonebook has info for ${response.length} people<br/><br/>${date}`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        return res.json(person.toJSON())
      } else {
        return res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {

  const person = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const new_p = new Person({
    name: req.body.name,
    number: req.body.number,
  })
  if (new_p.name === '' || new_p.number === '' ||
    new_p.name === null || new_p.number === null) {
    return res.json({ error: 'name or number missing' });
  }
  new_p.save().then(response => {
    res.status(200).json(response.toJSON())
  })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
};
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
