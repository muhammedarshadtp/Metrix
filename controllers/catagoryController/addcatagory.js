const { validateName } = require("../../config/validation");
const catagoryCollection = require("../../model/catagory-schema")






const addcatagory=async(req,res)=>{
    
    try {
        console.log(req.body,'=========');
        const catagorydata=req.body
 
        
      const validatedName=  validateName(catagorydata.name)
      const validatedDesc = validateName(catagorydata.description)
      console.log(validatedName);
        if(!validatedName){
            req.flash('error_msg', 'Please enter a valid Category name and should be at least 4 characters long ');
            
            return res.redirect('/admin/catagory')
             
        }
        if(!validatedDesc){
            req.flash('error_msg', 'Please enter a valid Category description and should be at least 4 characters long ');
            
             return res.redirect('/admin/catagory')
        }
        console.log(req.body);
        const existingCatagory=await catagoryCollection.findOne({ name:{ $regex: new RegExp("^" + catagorydata.name + "$", "i") }});
         
        if(existingCatagory){
            console.log("Category already exists:");
            req.flash('error_msg', 'Category already exists');
            
            return res.redirect('/admin/catagory')
           

        }else{
            
            const catagory= new catagoryCollection({
                name:catagorydata.name,
                description:catagorydata.description,
                catagoryOffer:catagorydata.catagoryOffer || 0,
            });
            await catagory.save();
            return res.redirect('/admin/catagory')
        }
        
    
   
    } catch (error) {
        console.log(error);
       
    }

}



module.exports={
    addcatagory,
}