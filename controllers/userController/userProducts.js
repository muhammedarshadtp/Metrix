const cartCollection = require("../../model/cart-schema");
const catagoryCollection = require("../../model/catagory-schema");
const productsCollection = require("../../model/products-schema");
const wishlistCollection = require("../../model/wishlist-schema");


const products = async (req, res) => {
    try {

        const limit = 8; 
        let page = Number(req.query.page) || 1; 

        const TOTAL_COUNT_OF_PRODUCT = await productsCollection.countDocuments()
        const totalPages = Math.ceil(TOTAL_COUNT_OF_PRODUCT / limit)

        page = Math.max(1,Math.min(page,totalPages))

        const skip = (page - 1) * limit;



        const user = req.session.isAuth;
        const userId = req.session.userId;
        let cart = await cartCollection.findOne({ userId: userId }).populate("items.productId");
        let product;
        const {catagory,sort} = req.query;
        console.log(req.query,'req query is showing');
        let search = req.query.search || ''
        console.log(search,'serach is showing');
       let query ={status:true,name: { $regex: new RegExp(search, 'i') }}
       console.log(catagory,'kitty');
        if (catagory && catagory !== 'all') {
          const catagoryDoc = await catagoryCollection.findOne({ name: catagory });
          if (catagoryDoc) {
            query.catagory = catagoryDoc._id;
          }
        }
        console.log(catagory,'kitty');
        console.log(sort);
        let sortOption = {};

        if (sort) {
            switch (sort) {
                case "highToLow":
                    sortOption = { price: -1 };
                    break;
                case "lowToHigh":
                    sortOption = { price: 1 };
                    break;
                case "productNameAZ":
                case "productNameZA":
                    // Fetch products without sort option initially for name sorting
                    // product = await productsCollection.find(query).populate("catagory").skip(skip).limit(limit);;
                    break;
                // Default sorting by newness
                default:
                    sortOption = { createdAt: -1 };
                    break;
            }
        } else {
            // Default sorting by newness if no sort parameter is provided
            sortOption = { createdAt: -1 };
        }

        if (!product) {
            // Fetch products with sort option if not already fetched
            product = await productsCollection.find(query).populate("catagory").sort(sortOption).skip(skip).limit(limit);
        }
        console.log(product ,'product is showing');
        // Apply name sorting if required
        if (sort === "productNameAZ") {
            product.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "productNameZA") {
            product.sort((a, b) => b.name.localeCompare(a.name));
        }
        const products = product.filter(product => product.catagory.status === true)
        const cartCount = cart !== null ? cart.items.length : 0;
        const wishlist =await wishlistCollection.findOne({userId:userId}).populate("item.productId")
        res.render('products', { data: products, user, cart, cartCount,sort,catagory,page,totalPages,count:TOTAL_COUNT_OF_PRODUCT,search,wishlist });
    } catch (error) {
        console.log(error,'products keri');
        return res.render('error_page');
    }
};



const productDetail = async (req, res) => {
    try {
        const user = req.session.isAuth
        const userId=req.session.userId
        const productData = req.params.id

        let cart  = await cartCollection.findOne({userId:userId}).populate("items.productId");
        const productDetail = await productsCollection.findOne({ _id: productData }).populate("catagory")
        console.log(productDetail, '---------------------------data is founded...');
        const relatedProduct = await productsCollection.find({catagory:productDetail.catagory._id})
        console.log(relatedProduct,"123456789");

        const wishlist = await wishlistCollection.find()
        const cartCount = cart !==  null ? cart.items.length : 0
        res.render('productDetail', { data: productDetail, user,cart,cartCount,relatedProduct,wishlist})
    } catch (error) {
        console.log(error,'productsDetails keri');
        return res.redirect('/error_page')

    }

}

module.exports={
    productDetail,
    products,

}