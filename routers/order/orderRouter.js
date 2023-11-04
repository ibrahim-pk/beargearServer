const express=require('express');
const myDB = require('../../DB/db');
const { verifyToken } = require('../../jwt/jwt');

const orderRouter=express.Router()

// Create an order
orderRouter.post('/add', (req, res) => {
    console.log(req.body);
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid token provided' }); // Changed the status code to 401 (Unauthorized)
    } else {
      const token = authHeader.slice(7);
      const userInfo = verifyToken(token);
      if (!userInfo || !userInfo.data) {
        return res.status(401).json({ error: 'Invalid token' }); // Handle invalid or missing user information
      }else{
        //Insert the order into the database
        const sql = 'INSERT INTO `order` (productList, userId, amount, userInfo, status) VALUES (?, ?, ?, ?, ?)';

        const values = [JSON.stringify(req.body?.cart), userInfo?.data?.id, req.body?.total, JSON.stringify(req.body?.formData), 0];
      
        myDB.query(sql, values, (err, result) => {
          if (err) {
            console.error('Error inserting order: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
        res.status(201).json({ 
            message: 'Order created successfully', 
            orderId: result.insertId});
        });
      }


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
  
    // Perform the status update in the database
    const sql = 'UPDATE orders SET status = "cancel" WHERE id = ?';
  
    myDB.query(sql, [orderId], (err, result) => {
      if (err) {
        console.error('Error updating order status: ' + err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json({ message: 'Order status updated to cancel' });
      }
    });
  });
  
  // Update the status of an order by ID to "confirm"
  orderRouter.put('/confirm/:orderId', (req, res) => {
    const orderId = req.params.orderId;
  
    // Perform the status update in the database
    const sql = 'UPDATE orders SET status = "confirm" WHERE id = ?';
  
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