const alphanumValid =(name)=>{
    try {
        if (name.trim() === '') {
            return false; // Return false for empty strings
        }
        nameRegex= /^(?! )[A-Za-z0-9 ]*(?<! )$/;
        return nameRegex.test(name)
        
    } catch (error) {
        console.log(error);
        res.render("users/serverError") 
    }
}
const isValidCoupon = (coupon) => {
    try {
        const couponRegex =  /^[A-Za-z0-9%]+(?:-[A-Za-z0-9%]+)?$/;
        return couponRegex.test(coupon);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const onlyNumbers =(str)=>{
    try {
        console.log(str,'str is shwoing');
        console.log(typeof str,'str is shwoing');

        const numbersOnlyRegex =/^[0-9][0-9]*(\.[0-9]+)?$/;
        return numbersOnlyRegex.test(str);
        
    } catch (error) {
        console.log(error);
        res.render("users/serverError") 
    }
}

const zerotonine = (str) => {
    try {
        const numbersOnlyRegex = /^(0|[1-9][0-9]*)$/;
        return str.length > 0 && numbersOnlyRegex.test(str);
        
    } catch (error) {
        console.log(error);
        res.render("users/serverError") 
    }
}

const AlphaOnly = (input) => {
    try {
        if(input.length === 0){
            return
        }
        const regex = /^[a-zA-Z]*$/;
        console.log('dumbel dore work avunundo');
        const result = regex.test(input);
    
        return result
        
    } catch (error) {
        console.log(error);
    
    }
}


const isFutureDate = (selectedDate) => {
    try {
        const selectedDateTime = new Date(selectedDate);
        const currentDate = new Date();
        return selectedDateTime > currentDate;
        
    } catch (error) {
        console.log(error);
        res.render("users/serverError") 
    }
}
module.exports={
    alphanumValid,
    onlyNumbers,
    zerotonine,
    AlphaOnly,
    isFutureDate,
    isValidCoupon
}