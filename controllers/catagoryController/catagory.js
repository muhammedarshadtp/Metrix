const catagoryCollection = require("../../model/catagory-schema")





const catagory=async(req,res)=>{

   try {
    const limit = 6; 
    let page = Number(req.query.page) || 1; 
        
    const TOTAL_COUNT_OF_CATAGORY = await catagoryCollection.countDocuments()
    const totalPages = Math.ceil(TOTAL_COUNT_OF_CATAGORY / limit);
    console.log(TOTAL_COUNT_OF_CATAGORY,'total count is showing');
    page = Math.max(1, Math.min(page, totalPages));

    const skip = (page - 1) * limit;

    const catagorydata=await catagoryCollection.find().skip(skip).limit(limit)
    const error = req.session.catagoryError
    req.session.catagoryError = '' 

    res.render('catagory',{catagorydata:catagorydata,error:error,page,totalPages, count: TOTAL_COUNT_OF_CATAGORY})
    

   } catch (error) {
    console.log("catagory error");
   }
    
}

const admin_manageCatagory = async(req,res)=>{
    try {
        const catagoryId=req.params.id
        const status = req.query.status
        console.log(`${catagoryId},${status}`);
        console.log(typeof status);
        const catagory = await catagoryCollection.findById(catagoryId)
        if(status==='true'){
            console.log('inside status true');
            await catagoryCollection.findByIdAndUpdate(catagoryId, {status:false})
            res.json({success:'hide'})
        }else{
            console.log('inside else case');
            await catagoryCollection.findByIdAndUpdate(catagoryId, {status:true})
            res.json({success:'unhide'})
        }

    } catch (error) {
        console.log(error,'admin mange catagory get');
        
        
    }
}


    module.exports={
        catagory,
        admin_manageCatagory,
    }