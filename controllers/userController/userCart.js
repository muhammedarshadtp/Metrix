const { ObjectId } = require("mongodb");
const cartCollection = require("../../model/cart-schema");
const productsCollection = require("../../model/products-schema");







const showcart = async (req, res) => {
    try {
        
      // Extract user ID and session ID from the request session
      const id = req.session.userId;
      const sessionId = req.session.id;
      const user = req.session.isAuth
      let cart;
      console.log(id === new ObjectId(id),'id is showing');
      // If user is logged in, find their cart and populate it with product details
      if (id) {
        cart = await cartCollection.findOne({ userId: new ObjectId(id) }).populate("items.productId");
      } else if (!cart || !cart.items) { // If user is not logged in or cart doesn't exist, create a new cart
        cart = new cartCollection({
          sessionId: req.session.id,
          items: [],
          Total: 0,
        });
      }

      console.log(cart,"ithu cart from cart");
      
      res.render("cart", { cart,user });
    } catch (error) {
      // If an error occurs, render a server error page
      console.log(error);
      return res.redirect('/error_page')
    }
  };
  


const cart = async (req, res) => {
    try {
        const pid=req.query.id
        console.log('entering');
        console.log(req.query);
        const product  = await productsCollection.findOne({_id:pid})
        console.log(product,'varuninde');
        const userId=req.session.userId
        const price =product.price;
        const stock=product.stock;
        const quantity=1;
        console.log(product.images)
        let images = product.images[0]
        console.log(images,'=========================')
        if(stock==0){
            res.redirect('/cartpage')
        }else{
            let cart;
            console.log(cart,'cart is shwoing')
            console.log(cart);
            if (userId) {
                cart = await cartCollection.findOne({ userId: userId }).populate("items.productId")
                console.log(cart,'cart')
              }
              if (!cart) {
                cart = await cartCollection.findOne({ sessionId: req.session.id }).populate("items.productId")
              }
              if (!cart) {
                // If no cart exists for the user, create a new one
                    cart = new cartCollection({
                    sessionId: req.session.id,
                    items: [],
                    Total: 0,
                });
            }
            
            if (!cart.items) {
                cart.items = [];
              }
               const productExist = cart.items.findIndex((item) => item.productId._id == pid); 
               if (productExist !== -1 ) {
                 const product =  cart.items.find(item=>item.productId._id.equals(pid))

                if(cart.items[productExist].quantity < 10 && cart.items[productExist].quantity < product.productId.stock){

                  cart.items[productExist].quantity += 1;
                  cart.items[productExist].total = cart.items[productExist].quantity * price;
                }else{
                  return res.json({result:'limit exceeded'})
                }
              }else{
                const newItem={
                    productId:pid,
                    quantity: 1,
                    images:images,
                    price:price,
                    Total:quantity*price,
                };
                cart.items.push(newItem);
              }

              if (userId && !cart.userId) {
                cart.userId = userId;
              }
              cart.Total = cart.items.reduce((acc, item) => acc + item.Total, 0);

              await cart.save();
              console.log(cart,'cart is showing ');
              res.json({result:"success"})
            
        }
    } catch (error) {
        console.log('Error fetching cart:', error);
        return res.redirect('/error_page')

    }

   
}

const updatecart = async (req, res) => {
    console.log(req.body);
    try {
      console.log("hi");
      console.log("Received Request:", req.body);
      const { productId } = req.params;
      const { action, cartId } = req.body;
      const cart = await cartCollection.findOne({ _id: cartId });
      console.log("cartId", cartId);
      console.log("cart", cart);
      console.log("productc id ", productId);
      const itemIndex = cart.items.findIndex((item) => item._id == productId);
      console.log(itemIndex);
  
      console.log("itemIndex", itemIndex);
      console.log("Cart Items:", cart.items);
  
      console.log(cart.items[itemIndex].quantity);
      console.log(cart.items[itemIndex].stock);
      console.log(cart.items[itemIndex].price);
      const currentQuantity = cart.items[itemIndex].quantity;
      const selectedProductId = cart.items[itemIndex].productId;
      const selectedProduct = await productsCollection.findOne({
        _id: selectedProductId,
      });
      console.log("selctedproduct", selectedProduct);
      const stockLimit = selectedProduct.stock;
      
      console.log("limit", stockLimit);
      const price = cart.items[itemIndex].price;
  
      let updatedQuantity;
  
      if (action == "1") {
        console.log("1",currentQuantity);
        updatedQuantity = currentQuantity + 1;
      } else if (action == "-1") {
        console.log("-1");
        updatedQuantity = currentQuantity - 1;
      } else {
        return res.status(400).json({ success: false, error: "Invalid action" });
      }
      if (
        updatedQuantity < 1 ||
        (updatedQuantity > stockLimit && action == "1")
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Quantity exceeds stock limits" });
      }
  
      cart.items[itemIndex].quantity = updatedQuantity;
  
      const newProductTotal = (price * updatedQuantity).toFixed(2)
      cart.items[itemIndex].Total = newProductTotal
      const total = cart.items.reduce((acc, item) => acc + item.Total, 0);
      console.log("total", total);
      console.log("items total:", newProductTotal);
      cart.Total = total
      console.log(cart,"gfdfgdfg");
      console.log(total,'tatal kitty=========================');
      await cart.save();
  
      res.json({
        success: true,
        newQuantity: updatedQuantity,
        newProductTotal,
        total: total,
      });
    } catch (error) {
      console.log(error);
      res.render("error_page")
    }
  };


  const deletecart = async (req, res) => {
    try {
        console.log('Deleting entering');
        const userId = req.session.userId;

        const pid = req.params.id;
        console.log("Deleting item ", { userId, pid });
        let data = await cartCollection.findOne({userId:userId})
        console.log(data,'data is shwoing successfully');
        const result = await cartCollection.updateOne(
            { userId: userId },
            { $pull: { items: { _id: pid } } }
        );

        console.log("Updated", result);

        if (!result.acknowledged) {
            console.error('Failed to update cart');
           
        }
         data = await cartCollection.findOne({userId:userId})
        console.log(data,'data');

        const newTotal = data.items.reduce((acc, item) => acc + item.Total, 0);
        console.log(newTotal,'total kitty');
        data.Total = newTotal;
        await data.save();

        res.json({result:'success'})
    } catch (error) {
        console.log(error, 'cart delete error');
        res.render("error_page");
    }
};

module.exports={
    deletecart,
    updatecart,
    cart,
    showcart,

}