const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const path = require('path')
const User = require('../models/user')
const ErrorResponse = require('../utils/errorResponse') 

// @desc            Register User
// @route           GET /api/v1/auth/register
// @access          Public
exports.register = asyncHandler(async (req,res,next) => {
    const { name, email, password, role } = req.body
    
    //Create a user
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    
    res.status(200).json({ succes : true })
})