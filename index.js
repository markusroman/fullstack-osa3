require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const Person = require('./models/person')

const app = express();
app.use(express.static("build"));

app.use(bodyParser.json());
app.use(cors());
morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms  :data")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.get("/api/persons", (req, res) => {
  Person.find({}).then(response => {
    res.status(200).json(response.map(p => p.toJSON()));
    mongoose.connection.close();
  })

});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.find({}).then(response => {
    res
      .status(200)
      .send(`Phonebook has info for ${response.length} people<br/><br/>${date}`);
    mongoose.connection.close();
  })

});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.status(200).json(person);
  } else {
    res.status(404).send("Error code 404: Person not found");
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    persons = persons.filter(p => p !== person);
    res.status(200).json({ success: "Deleting successful" });
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.post("/api/persons", (req, res) => {
  const name = req.body.name;
  const person = persons.find(p => p.name === name);
  if (person) {
    return res.status(400).json({ error: "Name must be unique" });
  } else if (!req.body.number || !req.body.name) {
    return res.status(400).json({ error: "Invalid name or/and number" });
  } else {
    const new_p = new Person({
      name: name,
      number: req.body.number,
    });
    new_p.save().then(response => {
      res.status(200).json(response[0].toJSON());
      mongoose.connection.close();
    })
  }
  return null
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
