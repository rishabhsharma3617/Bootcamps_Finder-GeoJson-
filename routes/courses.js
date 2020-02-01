const express = require('express')
const { getCourses , getCourse , addCourse , updateCourse , deleteCourse} = require('../controllers/courses')
const { protect,authorize } = require('../middleware/auth')
const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')
const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(advancedResults(Course,{
        path : 'bootcamp',
        select : 'name description'
    }),getCourses)
    .post(protect ,addCourse)

router
    .route('/:id')
    .get(getCourse)
    .put(authorize('publisher,admin') ,protect ,updateCourse)
    .delete(authorize('publisher,admin') ,protect , deleteCourse)
    

module.exports = router
