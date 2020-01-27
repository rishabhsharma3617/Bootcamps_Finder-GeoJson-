
// @desc            Get All bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({ success : true , msg : 'Show all bootcamps'})
}


// @desc            Get SIngle bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = (req,res,next) => {
    res.status(200).json({ success : true , msg : `Get Bootcamp with id ${req.params.id}`})
}


// @desc            Create a new Bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.createBootcamp = (req,res,next) => {
    res.status(200).json({ success : true , msg : 'Create new Bootcamp'})
}


// @desc            Update the bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = (req,res,next) => {
    res.status(200).json({ success : true , msg : `Update the bootcamp with id ${req.params.id}`})
}


// @desc            Delete Bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({ success : true , msg : `Delete the bootcamp with id ${req.params.id}`})
}