


const logout = async (req, res) => {
    req.session.isAuth = false
    res.redirect('/')
}

module.exports={
    logout, 
}