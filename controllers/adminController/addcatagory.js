const catagoryCollection = require("../../model/catagory-schema")






const addcatagory=async(req,res)=>{
    
    try {
        const catagorydata=req.body
        console.log(req.body);
        const existingCatagory=await catagoryCollection.findOne({name:catagorydata.name})
         
        if(existingCatagory){
            console.log("Category already exists:");
            res.redirect('/admin/catagory')
        }else{
            const catagory= await catagoryCollection.create([catagorydata])
        }
        
    
    res.redirect('/admin/catagory')
    } catch (error) {
        console.log(error);
    }

}



module.exports={
    addcatagory,
}