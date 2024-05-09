const express = require("express")
const routerAdmin = express.Router();

const adminController = require('../controllers/adminController/adminview');
const userlist = require('../controllers/adminController/userlist');
const dashboard = require('../controllers/adminController/dashboard');
const catagory = require("../controllers/adminController/catagory");
const addcatagory = require("../controllers/adminController/addcatagory");
const products = require("../controllers/adminController/products");
const addproducts = require("../controllers/adminController/addproducts");
const { upload } = require("../middleware/multer");
const admin_auth = require("../middleware/adminAuth");
const  productsedit  = require("../controllers/adminController/productsedit");
const  catagoryedit  = require("../controllers/adminController/catagoryedit");






routerAdmin.get('/login', adminController.admin_loginGet)

routerAdmin.post('/login', adminController.admin_loginPost)

routerAdmin.get('/dashboard', admin_auth, dashboard.dashboard_get)

routerAdmin.get('/users_list',admin_auth, userlist.userlist)

routerAdmin.get('/logout', adminController.admin_logoutGet)

routerAdmin.get('/userstatus/:id', admin_auth, userlist.userstatus)


routerAdmin.get('/catagory', admin_auth, catagory.catagory)

routerAdmin.get('/manage-catagory/:id',catagory.admin_manageCatagory)

routerAdmin.post('/addcatagory', addcatagory.addcatagory)

routerAdmin.get('/catagoryedit',catagoryedit.catagoryedit)

routerAdmin.post('/updatecatagory',catagoryedit.updatecatagory)

routerAdmin.get('/products', admin_auth, products.products)

routerAdmin.get('/manage-products/:id',products.admin_manageProducts)

routerAdmin.get('/adminaddproducts', admin_auth, addproducts.addproducts)

routerAdmin.post('/adminaddproducts', upload.array('image',3), addproducts.addproductspost)

routerAdmin.get('/productsedit',productsedit.productsedit)

routerAdmin.post('/productseditPost',upload.array('image',3), productsedit.productseditPost)
















module.exports = routerAdmin