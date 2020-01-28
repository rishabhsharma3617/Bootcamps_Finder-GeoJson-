const mongoose = require('mongoose')

const BootcampSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,'Please add a name'],
        unique : true,
        trim : true,
        maxlength : [50, 'Name cannot be more than 50 characters']
    },
    slug : String,
    description : {
        type : String,
        required : [true,'Please add a description'],
        maxlength : [500, 'desc cannot be more than 50 characters']
    },
    website : {
        type : String,
         match : [/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,'Please enter a vlaid url']
    },
    phone : {
        type : String,
       maxlength : [20,'please add avalid phone no']
    },
    email : {
        type : String,
        match : [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please add a valid email'],
    },
    address : {
        type : String,
        required : [true,'Please add an address']
    },
    location : {
        type: {
            type: String,
            enum: ['Point'],
            //required: true
          },
          coordinates: {
            type: [Number],
           // required: true,
            index : '2dsphere'
          },
          formattedAddress :String,
          street : String,
          city : String,
          state : String,
          zipcode : String,
          country : String,
    },
    careers : {
        type : [String],
        required : true,
        enum : [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other',
            'Digital Marketing'
        ]
    },
    averageRating : {
        type : Number,
        min : [1,'Rating must be atleast 1'],
        max : [10,'Rating cannot be more than 10']
    },
    averageCost : Number,
    photo : {
        type : String,
        default : 'no-photo.jpg'
    },
    housing : {
        type : Boolean,
        default : false
    },
    jobAssistance : {
        type : Boolean,
        default : false
    },
    jobGuarantee : {
        type : Boolean,
        default : false
    },
    acceptGi : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    
    
})

module.exports = mongoose.model('Bootcamp',BootcampSchema)