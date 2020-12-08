const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('person', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :person'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "12341234",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Mary Poppendieck",
    "number": "32-41-6423122",
    "id": 4
  },
  {
    "name": "Dan Abramov",
    "number": "123464",
    "id": 5
  }
]

app.get('/info', (request,response) => {
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people\n${date}`)
})

app.get('/api/persons', (request,response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.find(person => person.id === id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(persons.map(p => p.id))
  : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  person.id = maxId + 1
  const nameExist = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if(!body.name) {
    return response.status(400).json({
      error: 'name is require'
    })
  }

  if(!body.number) {
    return response.status(400).json({
      error: 'number is require'
    })
  }

  if(nameExist) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server is running on port ${PORT}`);