const cartCollection = require("../../model/cart-schema");
const productsCollection = require("../../model/products-schema");


const products = async (req, res) => {
    try {
        const user = req.session.isAuth;
        const userId = req.session.userId;
        let cart = await cartCollection.findOne({ userId: userId }).populate("items.productId");
        let product;
        const sort = req.query.sort;
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
                    product = await productsCollection.find({ status: true }).populate("catagory");
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
            product = await productsCollection.find({ status: true }).sort(sortOption).populate("catagory");
        }

        // Apply name sorting if required
        if (sort === "productNameAZ") {
            product.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "productNameZA") {
            product.sort((a, b) => b.name.localeCompare(a.name));
        }

        const products = product.filter(product => product.catagory.status === true);
        const cartCount = cart !== null ? cart.items.length : 0;

        res.render('products', { data: products, user, cart, cartCount });
    } catch (error) {
        console.log('products keri');
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
        const cartCount = cart !==  null ? cart.items.length : 0
        res.render('productDetail', { data: productDetail, user,cart,cartCount})
    } catch (error) {
        console.log('productsDetails keri');
        return res.render(' error_page')

    }

}

module.exports={
    productDetail,
    products,

}