

const google = async (req, res) => {
    console.log(userProfile);
    req.session.userid = userProfile._id

}

module.exports={
    google,

}