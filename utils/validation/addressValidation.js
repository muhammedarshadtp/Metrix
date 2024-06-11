const bnameValid =(fullname)=>{
    try{
        
    nameRegex=/^[A-Za-z]+$/
    return nameRegex.test(name)
    }catch(error){
        console.log(error);
        res.render("error_page")
    }
}

const adphoneValid=(phone)=>{
    try {
        phonRegex=/^[0-9]{10}$/
        return phonRegex.test(phone)
        
    } catch (error) {
        console.log(error);
        res.render("error_page")

    }
}

const pincodeValid=(code)=>{
    try {
        pincodeRegex=/^[0-9]{6}$/
        return pincodeRegex.test(code)
        
    } catch (error) {
        console.log(error);
        res.render("error_page")     
    }
}

module.exports={
    bnameValid,
    adphoneValid,
    pincodeValid,
    
}