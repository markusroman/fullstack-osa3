const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`Phonebook has info for ${persons.length} people<br/><br/>${date}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id, req.headers);
  const person = persons.find(p => {
    console.log(p.id, typeof p.id, id, typeof id);
    p.id === id;
  });
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
