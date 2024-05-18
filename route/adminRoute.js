const express = require("express")
const routerAdmin = express.Router();

const adminController = require('../controllers/adminController/adminview');
const userlist = require('../controllers/adminController/userlist');
const dashboard = require('../controllers/adminController/dashboard');
const catagory = require("../controllers/catagoryController/catagory");
const addcatagory = require("../controllers/catagoryController/addcatagory");
const products = require("../controllers/productsController/products");
const addproducts = require("../controllers/productsController/addproducts");
const { upload } = require("../middleware/multer");
const admin_auth = require("../middleware/adminAuth");
const  productsedit  = require("../controllers/productsController/productsedit");
const  catagoryedit  = require("../controllers/catagoryController/catagoryedit");






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

routerAdmin.post('/adminaddproducts', upload.array('image',5), addproducts.addproductspost)

routerAdmin.get('/productsedit',productsedit.productsedit)

routerAdmin.post('/productseditPost',upload.array('image',5), productsedit.productseditPost)
















module.exports = routerAdmin