const express = require('express')
const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamp') //Rout files
const logger = require('./middleware/logger')
const morgan = require('morgan') //it is used for custom logging
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')


//Load Env Variables
dotenv.config({ path: './config/config.env'})
//connecting to the database
connectDB();

const app = express()

//using the body parser 
app.use(express.json())

//our own custom logger
if(process.env.NODE_ENV === 'development')
{ app.use(morgan('dev')) }


//Mount  the Route
app.use('/api/v1/bootcamps',bootcamps)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server=app.listen(PORT ,console.log(`Server running in ${process.env.NODE_ENV} mode and on ${process.env.PORT} port`.yellow.bold))

//handle unhandle rejections 
process.on('unhandledRejection',(err,promise) => {
    console.log(`Error : ${err.message}.red`)
    server.close(() => process.exit(1))
})