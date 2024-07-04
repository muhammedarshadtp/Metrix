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
const order = require('../controllers/orderContoller/order');
const  orderDetails  = require("../controllers/orderContoller/orderDetails");
const coupon = require("../controllers/couponController/coupon");
const { orderReturn,orderReturnDetails,orderReturnConformation } = require("../controllers/orderContoller/orderReturn");


// -----------------AdminLogin-----------------//

routerAdmin.get('/login', adminController.admin_loginGet)

routerAdmin.post('/login', adminController.admin_loginPost)

// ---------------dashboard-------------------//



routerAdmin.get('/dashboard', admin_auth, dashboard.dashboard_get)

routerAdmin.post('/downloadsales', admin_auth, dashboard.downloadsales)

routerAdmin.get('/getSalesData',admin_auth,dashboard.getSalesData)




// ------------------userlist------------------------//

routerAdmin.get('/users_list',admin_auth, userlist.userlist)

routerAdmin.get('/userstatus/:id', admin_auth, userlist.userstatus)

// ----------------------catagory------------------//

routerAdmin.get('/catagory', admin_auth, catagory.catagory)

routerAdmin.get('/manage-catagory/:id',admin_auth,catagory.admin_manageCatagory)

routerAdmin.post('/addcatagory',admin_auth, addcatagory.addcatagory)

routerAdmin.get('/catagoryedit/:id',admin_auth,catagoryedit.catagoryedit)

routerAdmin.post('/updatecatagory',admin_auth,catagoryedit.updatecatagory)

// -----------------------Products---------------//

routerAdmin.get('/products', admin_auth, products.products)

routerAdmin.get('/manage-products/:id',admin_auth,products.admin_manageProducts)

routerAdmin.get('/adminaddproducts', admin_auth, addproducts.addproducts)

routerAdmin.post('/adminaddproducts',admin_auth, upload.array('image',5), addproducts.addproductspost)

routerAdmin.get('/productsedit',admin_auth,productsedit.productsedit)

routerAdmin.post('/productseditPost',admin_auth,upload.array('image',5), productsedit.productseditPost)

routerAdmin.get('/productImageDelete/:id/:images',admin_auth,productsedit.deleteImages)

// ------------------Order---------------------//

routerAdmin.get('/order',admin_auth,order.order)

routerAdmin.get('/orderDetails/:id',admin_auth,orderDetails.orderDetail)

routerAdmin.post('/updateOrderStatus',admin_auth,orderDetails.updateOrderStatus)

// ---------------------ReturnOrder-----------------------------//

routerAdmin.get('/orderReturn',admin_auth,orderReturn)

routerAdmin.get('/orderReturnDetails',admin_auth,orderReturnDetails)

routerAdmin.put('/orderReturnConformation',admin_auth,orderReturnConformation)

// ---------------coupon----------------//


routerAdmin.get('/coupon',admin_auth,coupon.coupon)

routerAdmin.post('/coupon',admin_auth,coupon.couponPost)

routerAdmin.put('/updateCoupon',admin_auth,coupon.updateCoupon)

routerAdmin.get('/couponEdit',admin_auth,coupon.couponEdit)

routerAdmin.put('/couponEdit',admin_auth,coupon.couponEditPut)

// ----------------logout-------------//

routerAdmin.get('/logout', adminController.admin_logoutGet)















module.exports = routerAdmin