const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/productsImages")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        console.log(uniqueSuffix, 'middleware file name is showing')
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

  const upload= multer({storage:storage})

  module.exports={
    upload,
  }