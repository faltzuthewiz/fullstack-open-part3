const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

// Morgan uses :method, :url, :status, :res[content-length - :response-time ms'
app.use(morgan('tiny'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/info', (request, response) => {
  const maxPeople = persons.length
  const now = new Date()
  response.send(`<p>Phonebook has info for ${maxPeople} people</p>
  <p>${now}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(person => {
    return person.id === id
  })
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const min = Math.ceil(1)
  const max = Math.floor(100000)
  const id = Math.floor(Math.random() * (max - min) + min)

  console.log(min)
  console.log(max)
  console.log(id)

  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log("body name is", body.name)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  const checkName = persons.find(person => person.name === body.name)
  console.log(checkName)

  if (checkName !== undefined) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  persons = persons.concat(person)

  response.json(person)
})



app.use(unknownEndpoint)