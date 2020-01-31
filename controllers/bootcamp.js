const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const ErrorResponse = require('../utils/errorResponse') 
// @desc            Get All bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps =asyncHandler( async (req,res,next) => {
       
        //copy req.query
        const reqQuery = {...req.query }
        
        //field to exclude
        const removeFields = ['select','sort']

        //loop over remove fields and delete them from rrqquery
        removeFields.forEach(param => delete reqQuery[param])

        //create query string
        let queryStr = JSON.stringify(reqQuery)

        //create operators
        queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g,match => `$${match}`)
        
        //Finding Resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

        //SELECT Fields
        if(req.query.select)
        {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }
        if(req.query.sort) {
            const sortBy = req.query.select.split(',').join(' ')
            query =  query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }


        //ADDING PAGINATION
         const page = parseInt(req.query.page, 10) || 1
         const limit = parseInt(req.query.limit, 10) || 25
         const skip = (page - 1) * limit
         const startIndex = (page - 1) * limit
         const endIndex = page * limit
         const total = await Bootcamp.countDocuments()

         query = query.skip(skip).limit(limit)   


        //Executing Query
        const bootcamps = await query

        //Pagination result 
        const pagination = {}

        if(endIndex < total){
            pagination.next = {
                page : page + 1,
                limit
            }
        }
        if(startIndex > 0) {
            pagination.prev = { 
                page : page -1,
                limit
            }
        }
        res.status(200).json({ success : true ,pagination : pagination ,data : bootcamps})

    
})


// @desc            Get SIngle bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = asyncHandler( async (req,res,next) => {
 
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp not found with the error respons ${req.params.id}`,404))
        }
        res.status(200).json({ success : true , data : bootcamp})
   
})


// @desc            Create a new Bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.createBootcamp = asyncHandler( async (req,res,next) => {
    console.log(req.body)
   
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({ success : true , data : bootcamp})
   
})


// @desc            Update the bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = asyncHandler( async (req,res,next) => {

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body ,{
            new : true,
            runValidators : true
        })
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp not found with the error respons ${req.params.id}`,404))
        }
        res.status(200).json({ success : true , msg : `Update the bootcamp with id ${req.params.id}`})
})


// @desc            Delete Bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = asyncHandler( async (req,res,next) => {
    
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp not found with the error respons ${req.params.id}`,404))
        }
        bootcamp.remove()
        res.status(200).json({ success : true ,  data : null})
    
})

// @desc            Get bootcamps within a Radius
// @route           GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access          Private
exports.getBootcampsInRadius = asyncHandler( async (req,res,next) => {
    
   const { zipcode,distance } = req.params
   //get lat/long from the geocoder
   const loc  = await geocoder.geocode(zipcode)
   const lat = loc[0].latitude
   const lng = loc[0].longitude
   
   //calc radius using radians
   //divide dist by the radius of earth
   //Earth radius = 6,378 km
    const radius = distance/6378

    const bootcamps = await Bootcamp.find({
        location : { $geoWithin: { $centerSphere : [ [lng,lat] , radius]}}
    })
    res.status(200).json({
        success : true,
        count : bootcamps.length,
        data : bootcamps
    })
})
