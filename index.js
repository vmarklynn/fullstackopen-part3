const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body ")
);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }
  next(error);
};

let entries = [];

app.get("/", (request, response) => {
  response.send("<h1>Hello world!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const phonebookSize = entries.length;
  const date = new Date();
  response.send(`<p>Phonebook has information for ${phonebookSize} people.</p>
    <p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        // Found a person
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  /* if (
    entries.some(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({ error: "resource already exists" });
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // entries = entries.concat(person);
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
