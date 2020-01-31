const advancedResults = (model,populate) => async (req,res,next) => {
    let query
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
    query = model.find(JSON.parse(queryStr))

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
     const total = await model.countDocuments()

     query = query.skip(skip).limit(limit)   
    //populate
    if(populate) {
        query = query.populate(populate)
    }

    //Executing Query
    const results = await query

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

    res.advancedResults = {
        success : true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports = advancedResults