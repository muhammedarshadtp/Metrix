const { validateName } = require("../../config/validation");
const catagoryCollection = require("../../model/catagory-schema")






const addcatagory=async(req,res)=>{
    
    try {
        const catagorydata=req.body

        
      const validatedName=  validateName(catagorydata.name)
      const validatedDesc = validateName(catagorydata.description)
      console.log(validatedName);
        if(!validatedName){
            req.flash('error_msg', 'Please enter a valid Category name');
            
            return res.redirect('/admin/catagory')
             
        }
        if(!validatedDesc){
            req.flash('error_msg', 'Please enter a valid Category description');
            
             return res.redirect('/admin/catagory')
        }
        console.log(req.body);
        const existingCatagory=await catagoryCollection.findOne({ name:{ $regex: new RegExp("^" + catagorydata.name + "$", "i") }});
         
        if(existingCatagory){
            console.log("Category already exists:");
            req.flash('error_msg', 'Category already exists');
            
            return res.redirect('/admin/catagory')
           

        }else{
            const catagory= await catagoryCollection.create([catagorydata])
            return res.redirect('/admin/catagory')
        }
        
    
   
    } catch (error) {
        console.log(error);
        return res.render('error_page')
    }

}



module.exports={
    addcatagory,
}