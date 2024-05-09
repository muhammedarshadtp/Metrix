const otpGenerator = require('otp-generator')

async function otpGeneratorUser (){
    return otpGenerator.generate(5,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})
}

module.exports = otpGeneratorUser