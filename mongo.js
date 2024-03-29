const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack-user:${password}@cluster0.pmvfl7y.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
    name: name,
    number: number,
})


if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person
        .find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
} else if (process.argv.length === 4 && process.argv.length < 5) {
    console.log('give phone number as an argument')
    process.exit(1)
} else if (process.argv.length === 5) {
    person.save().then(result => {
        console.log('added', person.name, 'number', person.number, 'to phonebook')
        mongoose.connection.close()
    })
}