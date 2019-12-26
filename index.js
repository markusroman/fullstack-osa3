require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Person = require('./models/person')
const mongoose = require('mongoose')
const app = express();
app.use(express.static("build"));
app.use(cors());
app.use(bodyParser.json());


const morgan = require("morgan");
morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms  :data")
);


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.get("/api/persons", (req, res) => {
  Person.find({}).then(response => {
    res.json(response.map(p => p.toJSON()));
  })

});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.find({}).then(response => {
    res.status(200).send(`Phonebook has info for ${response.length} people<br/><br/>${date}`)
  })
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findOne({ name: request.params.id })
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.put("/api/persons/:id", (req, res, next) => {

  const person = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findOneAndUpdate({ name: request.params.id }, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findOneAndDelete({ name: request.params.id })
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post("/api/persons", (req, res) => {

  const new_p = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  new_p.save().then(response => {
    res.status(200).json(response);
  })
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
