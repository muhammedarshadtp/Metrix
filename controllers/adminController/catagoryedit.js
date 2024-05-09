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
        const existingcatagory = await catagoryCollection.findOne({ name: data.name });

        if (existingcatagory && !data.name === existingcatagory.name) {
            console.log("Category already exists");
            // Send an error response with a status code and error message
            res.render('catagoryedit',{ catagorydata:data.name, error: "Category name already exists" });
        } else {
            const catagoryupdate = await catagoryCollection.updateOne(
                { _id: req.query.id },
                { $set: { name: req.body.name, description: req.body.description } }
            );
            console.log(catagoryupdate);
            res.redirect('/admin/catagory');
        }
    } catch (error) {
        console.log(error);
        return res.render('catagoryedit', { catagorydata: {}, error: error.message });
    }
};




module.exports={
    
    catagoryedit,
    updatecatagory,
}