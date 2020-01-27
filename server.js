const express = require('express')
const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamp') //Rout files
const logger = require('./middleware/logger')

//Load Env Variables
dotenv.config({ path: './config/config.env'})


const app = express()

//our own custom logger
app.use(logger)
//Mount  the Route
app.use('/api/v1/bootcamps',bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT ,console.log(`Server running in ${process.env.NODE_ENV} mode and on ${process.env.PORT} port`))