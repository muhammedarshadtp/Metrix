const catagoryCollection = require("../../model/catagory-schema")



const catagoryedit=async(req,res)=>{
    try {
        const catagoryId =req.query.id
        console.log(req.query.id);
        const catagorydata= await catagoryCollection.findById(catagoryId)
        console.log(catagorydata);
        res.render('catagoryedit', { catagorydata: catagorydata, error: undefined });


    } catch (error) {
        console.log(error);
    }
    
}

const updatecatagory = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const catagoryId = req.query.id
        console.log(catagoryId);
        const catagorydata = await catagoryCollection.findById(catagoryId)
        const existingcatagoryname = await catagoryCollection.findOne({name:data.name})

        function existOrNot (data){
            return data !== null ? 'exist' : 'not exist'
        }
       const result = existOrNot(existingcatagoryname)
       console.log(result);
        console.log(existingcatagoryname,'existitng');

        if (result === 'not exist' || catagorydata.name === data.name) {
            const catagoryupdate = await catagoryCollection.updateOne(
                { _id: req.query.id },
                { $set: { name: req.body.name, description: req.body.description } }
            );
            console.log(catagoryupdate);
            res.redirect('/admin/catagory');
        } else {
            
            req.session.catagoryError = 'Category already Exists'
            console.log("Category already exists");
            const error = req.session.catagoryError
            // Send an error response with a status code and error message
            res.render('catagoryedit',{ catagorydata:data, error: error });
        }
    } catch (error) {
        console.log(error);
       
        
    }
};




module.exports={
    
    catagoryedit,
    updatecatagory,
}