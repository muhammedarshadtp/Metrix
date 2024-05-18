const { validateName } = require("../../config/validation");
const catagoryCollection = require("../../model/catagory-schema")






const addcatagory=async(req,res)=>{
    
    try {
        const catagorydata=req.body

        
      const validatedName=  validateName(catagorydata.name)
      const validatedDesc = validateName(catagorydata.description)
      console.log(validatedName);
        if(!validatedName || !validatedDesc){
            req.session.catagoryError = 'Category name or description not valid'
            const error=req.session.catagoryError
            
             res.redirect('/admin/catagory')
             
        }
        console.log(req.body);
        const existingCatagory=await catagoryCollection.findOne({name:catagorydata.name})
         
        if(existingCatagory){
            console.log("Category already exists:");

            req.session.catagoryError = 'Category already Exist'
            
            res.redirect('/admin/catagory')
           

        }else{
            const catagory= await catagoryCollection.create([catagorydata])
            res.redirect('/admin/catagory')
        }
        
    
   
    } catch (error) {
        console.log(error);
    }

}



module.exports={
    addcatagory,
}