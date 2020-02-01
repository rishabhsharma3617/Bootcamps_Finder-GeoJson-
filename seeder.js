const mongoose = require('mongoose')
const fs = require('fs')
const colors = require('colors')
const dotenv = require('dotenv')
const Bootcamp = require('./models/Bootcamp')
const User = require('./models/user')
const Course = require('./models/Course')
dotenv.config({path : './config/config.env'})

//connect with the db its different than the server file
mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology : true
})

//Read Json files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
)
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`)
)
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`)
)
//Import into DB

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        console.log('Data Imported ....'.green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}
//DElete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log('Data Deleted ....'.red.inverse)
        process.exit()
    } catch (error) {
        console.log(err)
    }
}

if(process.argv[2] === '-i'){
    importData()
} else if(process.argv[2]==='-d')
{
    deleteData()
}
