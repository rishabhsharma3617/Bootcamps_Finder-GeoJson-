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
    
    sendTokenResponse(user,200,res)
})




// @desc            Login User
// @route           POST /api/v1/auth/login
// @access          Public
exports.login = asyncHandler(async (req,res,next) => {
    const { email, password} = req.body
   //Validate email and Password
    if(!email || !password)
    {
        return next(new ErrorResponse('Please Provide an email and password',400))
    }
    const user = await User.findOne({ email : email}).select('+password')

    if(!user) { 
        return next(new ErrorResponse('Invalid Credentials',401))
    }

    //Check if password matches 
    const isMAtch = await user.matchPassword(password)
    
    if(!isMAtch){
        return next(new ErrorResponse('Invalid Credentials',401))
    }

    sendTokenResponse(user,200,res)
})


// @desc            Get current logged in User
// @route           POST /api/v1/auth/me
// @access          Private
exports.getMe = asyncHandler(async (req,res,next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success : true,
        data : user
    })
})

// Get token from model,create cookie and send Token response
const sendTokenResponse = (user , statusCode ,res) => {
    console.log('shhsghdsgdhsgdhsgd')
    const token = user.getSignedJwtToken()
    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *60 * 60 * 1),
        httpOnly : true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }
 res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success : true,
        token
    })
}