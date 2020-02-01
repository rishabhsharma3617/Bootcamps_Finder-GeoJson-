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
const { protect,authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults')
//Reroute into another route resource
router.use('/:bootcampId/courses', courseRouter)


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(protect,authorize('publisher,admin') ,bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(protect ,authorize('publisher,admin') ,createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect ,authorize('publisher,admin') ,updateBootcamp)
    .delete(protect ,authorize('publisher,admin') ,deleteBootcamp)


module.exports = router