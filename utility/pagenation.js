const pagination = (req)=>{
    //const {page, limit}= req.query

    const page = req.query.page || 1

    const limit = req.query.limit || 2

    const skip = limit * (page - 1)

    return{ page, limit, skip}

    
}

module.exports = {pagination}