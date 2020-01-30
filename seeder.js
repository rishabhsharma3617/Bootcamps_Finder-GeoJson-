const mongoose = require('mongoose')
const fs = require('fs')
const colors = require('colors')
const dotenv = require('dotenv')
const Bootcamp = require('./models/Bootcamp')
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

//Import into DB

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data Imported ....'.green.inverse)
        process.exit()
    } catch (error) {
        console.log(err)
    }
}
//DElete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log('Data Deleted ....'.green.inverse)
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
