const express = require('express')
const router = express.Router()
const courseRouter = require('./courses')
const Bootcamp = require('../models/Bootcamp')
const { getBootcamps,
        getBootcamp,
        createBootcamp,
        updateBootcamp,
        deleteBootcamp,
        getBootcampsInRadius,
        bootcampPhotoUpload
    } = require('../controllers/bootcamp')

const advancedResults = require('../middleware/advancedResults')
//Reroute into another route resource
router.use('/:bootcampId/courses', courseRouter)


    router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)


module.exports = router