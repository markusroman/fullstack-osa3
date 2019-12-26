const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
console.log(process.argv)
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@osa3-ee18d.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})
if (process.argv.length === 3) {
    Person.find({}).then(response => {
        console.log('phonebook: ')
        response.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close();
    })
} else if (process.argv.length === 4) {
    Person.find({ name: `${name}` }).then(response => {
        console.log(`Number of ${name} is ${response[0].number}`)
        mongoose.connection.close();
    })
} else {
    person.save().then(response => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    })
}
