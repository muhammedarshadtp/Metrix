const catagoryCollection = require("../../model/catagory-schema")





const catagory=async(req,res)=>{

   try {
    const catagorydata=await catagoryCollection.find()
    res.render('catagory',{catagorydata:catagorydata})

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