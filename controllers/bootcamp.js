const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const path = require('path')
const geocoder = require('../utils/geocoder')
const ErrorResponse = require('../utils/errorResponse') 
// @desc            Get All bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps =asyncHandler( async (req,res,next) => {
       
     
        res.status(200).json(res.advancedResults)
    
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
   //Add user to req.body
   req.body.user = req.user.id

   //Check for the published bootcamps
   const publishedBootcamp = await Bootcamp.findOne({ user : req.user.id })

   // If the user is not an admin , they can only add one bootcamp
   if(publishedBootcamp && req.user.role!=='admin') {
       return next(new ErrorResponse(`The user withID ${req.user.id} has already published a bootcamp`,400))
   }
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


// @desc            Delete Bootcamp
// @route           PUT /api/v1/bootcamps/:id/photo
// @access          Private
exports.bootcampPhotoUpload = asyncHandler( async (req,res,next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id)
   
    if(!bootcamp)
    {
        return next(new ErrorResponse(`Bootcamp not found with the error respons ${req.params.id}`,404))
    }
    
    if(!req.files) {
        return next(new ErrorResponse(`Please upload a file`,400))
    }
    
    const file = req.files.file

    //make sure that the file is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`,400))
    }

    //check the filesize
    if(!file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image file with size less than ${process.env.MAX_FILE_UPLOAD}`,400))
    }

    //Create the custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    console.log(file.name)

    //Upload the file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.log(process.env.FILE_UPLOAD_PATH)
            return next(new ErrorResponse(`Problem with File Upload`,500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name})
    res.status(200).json({
        success: true,
        data: file.name
    })
    })

    
})
