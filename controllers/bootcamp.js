const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const geocoder = require('../utils/geocoder')
const ErrorResponse = require('../utils/errorResponse') 
// @desc            Get All bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps =asyncHandler( async (req,res,next) => {

        const bootcamps = await Bootcamp.find()
        res.status(200).json({ success : true ,data : bootcamps})

    
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
    
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp not found with the error respons ${req.params.id}`,404))
        }
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
