const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body ",
    {
      skip: (req, res) => {
        return req.method !== "POST";
      },
    }
  )
);

let entries = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateRandomId = (max) => {
  return Math.floor(Math.random() * max);
};

app.get("/api/persons", (request, response) => {
  response.json(entries);
});

app.get("/info", (request, response) => {
  const phonebookSize = entries.length;
  const date = new Date();
  response.send(`<p>Phonebook has information for ${phonebookSize} people.</p>
    <p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = entries.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  entries = entries.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (
    entries.some(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({ error: "resource already exists" });
  }

  const person = {
    id: generateRandomId(10000),
    name: body.name,
    number: body.number,
  };

  entries = entries.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
