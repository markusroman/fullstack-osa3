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


app.get("/api/persons", (req, res) => {
  Person.find({}).then(response => {
    return res.json(response.map(p => p.toJSON()));
  })

});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.find({}).then(response => {
    return (res
      .status(200)
      .send(`Phonebook has info for ${response.length} people<br/><br/>${date}`))
  })

});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        return res.json(person.toJSON())
      } else {
        return res.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.put("/api/persons/:id", (req, res, next) => {

  const person = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      return response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
});

app.delete("/api/persons/:id", (req, res) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      return response.status(204).end()
    })
    .catch(error => next(error))
});

app.post("/api/persons", (req, res) => {
  if (!req.body.number || !req.body.name) {
    return res.status(400).json({ error: "Invalid name or/and number" });
  }
  Person.find({}).then(response => {
    response.forEach(p => {
      if (p.name === req.body.name) {
        return res.status(400).json({ error: "Name must be unique" });
      }
    })
    mongoose.connection.close();
  })

  const new_p = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  new_p.save().then(response => {
    return res.status(200).json(response[0].toJSON());
  })
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
