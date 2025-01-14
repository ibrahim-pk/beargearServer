const express=require('express');
const myDB = require('../../DB/db');
const { verifyToken } = require('../../jwt/jwt');
const short = require('short-uuid');
const orderRouter=express.Router()
const translator = short();
const shortOrderId = translator.new();
const { v4: uuidv4 } = require("uuid");

const SSLCommerzPayment = require("sslcommerz");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".env" });
}


//get order
orderRouter.get('/get', (req, res) => {
   //console.log('order');
  const authHeader = req.headers['authorization'];
  //console.log(authHeader);

  try{

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ error: 'No valid token provided' }); // Changed the status code to 401 (Unauthorized)
    } else {
      const token = authHeader.slice(7);
      const userInfo = verifyToken(token);
      //console.log(userInfo);
      if (!userInfo || !userInfo.data || userInfo.msg==='0') {
        return res.status(200).json({ error: 'Invalid token' }); // Handle invalid or missing user information
      }else{
        //Insert the order into the database
        const sql = 'SELECT * FROM orders';
      
        myDB.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting order: ' + err.message);
            res.status(200).json({ error: 'Internal Server Error' });
            return;
          }
         // console.log(result);
        res.status(200).json({ 
            message: 'Order fetch successfully', 
            orders: result});
        });
      }


    }

  }catch(err){
     console.log(err);
  }


});

//get order by id in profile/order
orderRouter.get('/get/id', (req, res) => {
 
 const authHeader = req.headers['authorization'];
 

 try{

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
     return res.status(200).json({ error: 'No valid token provided' }); // Changed the status code to 401 (Unauthorized)
   } else {
     const token = authHeader.slice(7);
     const userInfo = verifyToken(token);
    // console.log("orderUser:",userInfo);
     const userId=userInfo?.data?.id
     if (!userInfo || !userInfo.data || userInfo.msg==='0') {
       return res.status(200).json({ error: 'Invalid token' }); // Handle invalid or missing user information
     }else{
      //Insert the order into the database
      const sql = `SELECT * FROM orders where userId=${userId}`;
      
      myDB.query(sql, (err, result) => {
        if (err) {
          console.error('Error inserting order: ' + err.message);
          res.status(200).json({ error: 'Internal Server Error' });
          return;
        }
       // console.log(result);
      res.status(200).json({ 
          message: 'Order fetch successfully', 
          orders: result});
      });
    }
       
  }
       

 }catch(err){
    console.log(err);
 }


});

//get order by orderid in admin/order
orderRouter.get('/get/order/:id', (req, res) => {
  const orderId=req.params.id
  const authHeader = req.headers['authorization'];
  //console.log(orderId);
 
  try{
 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ error: 'No valid token provided' }); // Changed the status code to 401 (Unauthorized)
    } else {
      const token = authHeader.slice(7);
      const userInfo = verifyToken(token);
     // console.log("orderUser:",userInfo);
      //const userId=userInfo?.data?.id
      if (!userInfo || !userInfo.data || userInfo.msg==='0') {
        return res.status(200).json({ error: 'Invalid token' }); // Handle invalid or missing user information
      }else{
       //Insert the order into the database
       const sql = `SELECT * FROM orders where id=${orderId}`;
       
       myDB.query(sql, (err, result) => {
         if (err) {
           console.error('Error inserting order: ' + err.message);
           res.status(200).json({ error: 'Internal Server Error' });
           return;
         }
        // console.log(result);
       res.status(200).json({ 
           message: 'Order fetch successfully', 
           orders: result});
       });
     }
        
   }
        
 
  }catch(err){
     console.log(err);
  }
 
 
 });

// Create an order
orderRouter.post('/add', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' });
  }

  const token = authHeader.slice(7);
  const userInfo = verifyToken(token);

  if (!userInfo || !userInfo.data || userInfo.msg === '0') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { cart, total, formData } = req.body;
  if (!cart || !total || !formData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = {
    total_amount: total,
    currency: "BDT",
    tran_id: uuidv4(),
    success_url: "http://localhost:5000/api/user/success",
    fail_url: "http://localhost:5000/api/user/fail",
    cancel_url: "http://localhost:5000/api/user/cancel",
    ipn_url: "http://yoursite.com/ipn",
    payment: false,
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
  };

  const shortOrderId = data.tran_id;

  try {
    const sql = `INSERT INTO orders 
                 (productList, userId, amount, userInfo, orderId, tran_id, payment) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      JSON.stringify(cart),
      userInfo.data.id,
      total,
      JSON.stringify(formData),
      shortOrderId,
      data.tran_id,
      false,
    ];

    // Insert order into the database
    myDB.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting order:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }


      console.log( process.env.SSL_STORE_ID)

      const sslcommer = new SSLCommerzPayment(
        process.env.SSL_STORE_ID,
        process.env.SSL_SECRET_KEY,
        false
      );

      // Initialize payment with SSLCommerz
      sslcommer.init(data)
        .then((response) => {
          if (response.GatewayPageURL) {
            res.status(200).json({
              message: 'Order created successfully',
              orderId: result.insertId,
              paymentUrl: response.GatewayPageURL,
            });
          } else {
            res.status(500).json({ error: 'SSLCommerz session failed' });
          }
        })
        .catch((sslErr) => {
          console.error('SSLCommerz error:', sslErr);
          res.status(500).json({ error: 'Payment initialization failed' });
        });
    });
  } catch (err) {
    console.error('Error processing order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  // Delete an order by ID
  orderRouter.delete('/:orderId', (req, res) => {
    const orderId = req.params.orderId;
  
    // Perform the deletion in the database
    const sql = 'DELETE FROM orders WHERE id = ?';
  
    myDB.query(sql, [orderId], (err, result) => {
      if (err) {
        console.error('Error deleting order: ' + err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json({ message: 'Order deleted successfully' });
      }
    });
  });
// Update the status of an order by ID to "cancel"
orderRouter.put('/cancel/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    //console.log(orderId);
    // Perform the status update in the database
    const sql = 'UPDATE orders SET status = -1 WHERE id = ?';
  
    myDB.query(sql, [orderId], (err, result) => {
      if (err) {
        console.error('Error updating order status: ' + err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json({ msg: 'Order status updated to cancel' });
      }
    });
  });
  
  // Update the status of an order by ID to "confirm"
  orderRouter.put('/confirm/:orderId', (req, res) => {
    const orderId = req.params.orderId;
  
    // Perform the status update in the database
    const sql = 'UPDATE orders SET status = 1 WHERE id = ?';
  
    myDB.query(sql, [orderId], (err, result) => {
      if (err) {
        console.error('Error updating order status: ' + err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json({ message: 'Order status updated to confirm' });
      }
    });
  });
    
module.exports=orderRouter