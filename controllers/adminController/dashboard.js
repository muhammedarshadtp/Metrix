const catagoryCollection = require('../../model/catagory-schema')
const orderCollection =require('../../model/order-schema')
const productsCollection = require('../../model/products-schema')
const userCollection = require('../../model/user-schema')
const {isFutureDate} = require('../../utils/validation/adminValidation')
const ExcelJS = require('exceljs');
const fs=require('fs')
const os=require('os')
const path=require('path')
const puppeteer=require('puppeteer')


const dashboard_get=async(req,res)=>{
   try {
    const userId=req.session.userId


  // Aggregation to get count and total amount of delivered orders
  const deliveredOrders = await orderCollection.aggregate([
    // Match orders that have at least one delivered product
    {
      $match: {
        "products.status": "Delivered"
      }
    },
    // Unwind products array to filter products by status
    {
      $unwind: "$products"
    },
    // Match only delivered products
    {
      $match: {
        "products.status": "Delivered"
      }
    },
    // Group by orderId to get total count and amount of delivered orders
    {
      $group: {
        _id: "$_id",
        totalOrderAmount: { $first: "$totalPrice" },
        productCount: { $sum: 1 }
      }
    },
    // Summarize the results
    {
      $group: {
        _id: null,
        orderCount: { $sum: 1 },
        totalOrderAmount: { $sum: "$totalOrderAmount" },
        productCount: { $sum: "$productCount" }
      }
    }
  ]);



  const topProduct = await orderCollection.aggregate([
    {$unwind:'$products'},
    {
        $group:{
            _id:"$products.name",
            totalQuantity:{$sum:"$products.quantity"}

        }
    },
    {$sort:{totalQuantity:-1}},
    {$limit:6}
  ]);
  console.log(topProduct,'edfnaseugh');
  

  const topCategories = await orderCollection.aggregate([
    {
        $unwind: "$products"
    },
    {
        $addFields: {
            "products.productId": { $toObjectId: "$products.productId" }
        }
    },
    {
        $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetails"
        }
    },
    {
        $unwind: "$productDetails"
    },
    {
        $lookup: {
            from: "catagories", // Assuming your  collection is named "categories"
            localField: "productDetails.catagory",
            foreignField: "_id",
            as: "catagoryDetails"
        }
    },
    {
        $unwind: "$catagoryDetails"
    },
    {
        $group: {
            _id: "$productDetails.catagory", // Group by category ID
            totalQuantity: { $sum: "$products.quantity" },
            catagoryName: { $first: "$catagoryDetails.name" } // Assuming the category name field is "name"
        }
    },
    {
        $sort: { totalQuantity: -1 }
    },
    {
        $limit: 10 // Adjust the limit as needed
    },
    {
        $project: {
            _id: 0,
            catagory: "$_id",
            catagoryName: 1,
            totalQuantity: 1
        }
    }
    
  ])

  console.log(topCategories,"kitty mutheee");



  const [orders, products, categories, usersCount] = await Promise.all([
      orderCollection.find(),
        productsCollection.find(),
        catagoryCollection.find(),
        userCollection.find().count()
      ]);

    const orderCount= orders.length;
    let totalOrderAmount
    if(deliveredOrders.length > 0){
        totalOrderAmount=deliveredOrders[0].totalOrderAmount
    }
    // console.log(products,"=-=-=-=-=-")
    const productCount=products.length
    const categoryCount=categories.length



    console.log(orderCount,usersCount,totalOrderAmount,productCount,categoryCount,);
    // console.log(deliveredOrders,'deli order');
    res.render('dashboard',{orderCount,usersCount,topProduct,topCategories,totalOrderAmount,productCount,categoryCount,expressFlash:{derror:req.flash('derror')}})
   } catch (error) {
    console.log(error);
   }
}

const downloadsales = async (req, res) => {
    try {
        console.log("salesReport");
        const { startDate, endDate } = req.body;
        console.log("Start Date is:", startDate);
        console.log("End Date is:", endDate);

        console.log('1 ------------------------------------------------------------------------');
        

        // console.log("Product details:", Product);
        console.log('2 ------------------------------------------------------------------------');

        const status = await orderCollection.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $group: {
                    _id: "$products.status",
                    count: { $sum: 1 },
                },
            },
        ]);

        console.log(status,'3 ------------------------------------------------------------------------');

        const revenue = await orderCollection.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $match: {
                    "products.status": "Delivered",
                },
            },
            {
                $project: {
                    amount: {
                        $multiply: ["$products.quantity", "$products.price"],
                    },
                },
            },
            {
                $group: {
                    _id: "",
                    total_revenue: { $sum: "$amount" },
                },
            },
        ]);

        console.log(revenue,'4 ------------------------------------------------------------------------');

        const orderData = await orderCollection.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $match: { "products.status": "Delivered" },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        console.log(orderData,'5 ------------------------------------------------------------------------');

        const totalRevenue = revenue.length > 0 ? revenue[0].total_revenue : 0;

        const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sales Report - METRIX</title>
                    <style>
                        body {
                            margin-right: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h2 align="center"> Sales Report  Metrix</h2>
                    From: ${startDate}<br>
                    To: ${endDate}<br>
                    <center>
                    <h3>Orders  </h3>
                        <table style="border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #000; padding: 8px;">#</th>
                                    <th style="border: 1px solid #000; padding: 8px;">User</th>
                                    <th style="border: 1px solid #000; padding: 8px;">DoO</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Order ID</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Shipped to</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Product Name</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Rate</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Qty</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Paid By</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                ${orderData.map(
            (item, index) => `
                                    <tr>
                                        <td style="border: 1px solid #000; padding-left: 8px;">${index + 1}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.address.name}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.orderDate.toLocaleDateString()}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.orderId}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.address.name}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.products.name}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.products.price}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.products.quantity}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.paymentMethod}</td>
                                        
                                    </tr>`
        )}
                            </tbody>
                        </table>
                    </center>
                    <br>
                    <center>
                    <h3>Order Status</h3>
                        <table style="border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #000; padding: 8px;">#</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Status</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${status.map(
            (item, index) => `
                                    <tr>
                                        <td style="border: 1px solid #000; padding: 8px;">${index + 1}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item._id}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.count}</td>
                                    </tr>`
        )}
                            </tbody>
                        </table>
                    </center>
                    <br>
                    <center>
                    <h3>Total Revenue generated: <span>₹ ${totalRevenue}</span></h3>
                    </center>
                    <p style="padding-left:20px;">Summary:<br>A total of ${orderData.length} products have been delivered. Total revenue generated is worth ₹ ${totalRevenue}.  </p>
                </body>
                </html>
            `;

            const browser = await puppeteer.launch({
                executablePath: "/usr/bin/chromium-browser",
              });
              const page = await browser.newPage();
              await page.setContent(htmlContent);
          
              const pdfBuffer = await page.pdf();
          
              await browser.close();
          
              res.setHeader("Content-Length", pdfBuffer.length);
              res.setHeader("Content-Type", "application/pdf");
              res.setHeader(
                "Content-Disposition",
                "attachment; filename=Bagdot-Sales.pdf"
              );
              res.status(200).end(pdfBuffer);
           

    } catch (e) {
        console.log('error in the salesReport:', e);
        res.redirect('/admin/error');
    }
}


const getSalesData = async (req, res) => {
    try {
        console.log("getSalesData");
        const { filter } = req.query;
        console.log("filter--------->>>", filter);
        let salesData = {};
        if (filter === "yearly") {
            salesData = await getYearlySalesData();
        } else if (filter === "monthly") {
            salesData = await getMonthlySalesData();
        } else if (filter === "daily") {
            salesData = await getDailySalesData();
        } else {
            throw new Error("Invalid filter parameter");
        }

        res.json(salesData);
    } catch (error) {
        console.log("Error while getSalesData in adminController", error);
    }
};




async function getDailySalesData() {
    const Aggregation = await orderCollection.aggregate([
        {
            $match: {
                orderDate: { $exists: true },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
    console.log("Aggregation value for daily graph is: ", Aggregation);

    const saleDate = Aggregation.map((item) => item._id);
    const count = Aggregation.map((item) => item.count);
    return { saleDate, count };
}




async function getMonthlySalesData() {
    const Aggregation = await orderCollection.aggregate([
        {
            $match: {
                orderDate: { $exists: true },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$orderDate" },
                    month: { $month: "$orderDate" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
    ]);

    console.log("Aggregation value for monthly graph is: ", Aggregation);
    const saleDate = Aggregation.map((item) => item._id.month);
    const count = Aggregation.map((item) => item.count);
    return { saleDate, count };
}



async function getYearlySalesData() {
    const getYearlySalesData = await orderCollection.aggregate([
        {
            $match: {
                orderDate: { $exists: true },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$orderDate" },
                },
                count: { $sum: 1 },
            },
        },

    ]);

    console.log("Aggregation value for yearly graph is: ", getYearlySalesData);
    const saleDate = getYearlySalesData.map((item) => item._id.year);
    const count = getYearlySalesData.map((item) => item.count);
    return { saleDate, count };
}

module.exports={
    dashboard_get,
    downloadsales,
    getSalesData,

}