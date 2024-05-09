const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config()


const connetDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('MONGODB CONNECTED SUCESSFULL')
    } catch (error) {
        console.log('Error CATACHED',Error)
    }
}

module.exports=connetDB