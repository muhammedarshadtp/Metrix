
const nodemailer = require('nodemailer')


const sendOrderMailSuccess = async (email, name, orderId, products, totalPrice) => {


  // connect with the smtp
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: "arshadtp89@gmail.com",
          pass: "lyzd iior rapc wnxz",
      }
  });
  const productListHTML = products.map(product =>
   `<tr>
    <td>${product.name}</td>
    <td>${product.quantity}</td>
    <td>${product.price}</td>
  </tr>`)
  .join('');

  let info = await transporter.sendMail({
      from: '"arshad " <arshadtp89@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Hi ${name}`, // Subject line
      text: `Your product place successfully`, // plain text body
      html: `
      <h1>Order Confirmation</h1>
      <p>Hi ${name},</p>
      <p>Thank you for your order. Your order ID is <strong>${orderId}</strong>.</p>
      <h2>Order Details:</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${productListHTML}
        </tbody>
      </table>
      <h3>Total Price: Rs${totalPrice}</h3>
      <p>We will notify you once your order is shipped.</p>
      <p>Thank you for shopping with us!</p>
    `, // html body
  });
};

const sendOrderMailFailure = async (email, name, orderId, products, totalPrice) => {


    // connect with the smtp
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "arshadtp89@gmail.com",
            pass: "lyzd iior rapc wnxz",
        }
    });
    const productListHTML = products.map(product =>
     `<tr>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.price}</td>
    </tr>`)
    .join('');

    let info = await transporter.sendMail({
        from: '"arshad " <arshadtp89@gmail.com>', // sender address
        to: email, // list of receivers
        subject: `Hi ${name}`, // Subject line
        text: `Your order failed kindly reorder`, // plain text body
        html: `
        <h1>Order Failed</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your order. Your order ID is <strong>${orderId}</strong>.</p>
        <h2>Order Details:</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productListHTML}
          </tbody>
        </table>
        <h3>Total Price: Rs${totalPrice}</h3>
      `, // html body
    });
};

module.exports ={ sendOrderMailFailure,sendOrderMailSuccess}