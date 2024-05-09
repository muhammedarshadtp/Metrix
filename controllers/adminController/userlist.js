const userCollection = require("../../model/user-schema")

const { ObjectId } = require('mongodb')





const userlist=async(req,res)=>{

    try {
        const userdatas = await userCollection.find({admin:false})
    console.log(userdatas);
    res.render('userlist',{userdatas})
    } catch (error) {
        console.log("userlist error");
        
    }
}


    const userstatus=async(req,res)=>{
        try {
        const userid=req.params.id
        const userstatus=req.query.status
        console.log(`${userid},${userstatus}`);
        console.log(typeof userstatus);
        console.log(userid);
        if(userstatus==="true"){
            console.log("hide")
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