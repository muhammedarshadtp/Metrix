const userCollection = require("../../model/user-schema")

const { ObjectId } = require('mongodb')





const userlist=async(req,res)=>{

    try {
        const limit = 6; 
        let page = Number(req.query.page) || 1; 
            
        const TOTAL_COUNT_OF_USERS = await userCollection.countDocuments()
        const totalPages = Math.ceil(TOTAL_COUNT_OF_USERS / limit);
        page = Math.max(1, Math.min(page, totalPages));
    
        const skip = (page - 1) * limit;
        const userdatas = await userCollection.find({admin:false}).skip(skip).limit(limit)
    console.log(userdatas);
    res.render('userlist',{userdatas,page,totalPages, count: TOTAL_COUNT_OF_USERS})
    } catch (error) {
        console.log("userlist error");
        
    }
}


    const userstatus=async(req,res)=>{
        try {
        const userid=req.params.id
        const userstatus=req.query.status
        console.log(`${userid},${userstatus}`);
        if(userstatus==="true"){
            console.log("hide")
            req.session.isAuth = false
            await userCollection.findByIdAndUpdate({ _id:new ObjectId(userid) },{ $set: { status: false } });
            res.json({success:'hide'})
        }else{
            console.log("not")
            await userCollection.findByIdAndUpdate({ _id:new ObjectId(userid) },{ $set: { status: true } });
            res.json({success:'unhide'})
        }
  
} catch (error) {
    console.log(error);
    }
} 






module.exports={
    userlist,
    userstatus

}