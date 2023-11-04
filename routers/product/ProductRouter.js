const express=require('express');
const myDB = require('../../DB/db');
const { verifyToken } = require('../../jwt/jwt');

const productRouter=express.Router()




productRouter.get('/getProducts', (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const perPage = parseInt(req.query.perPage, 10) || 2;

  // Search parameters
  const searchBrand = req.query.brand;
  const searchColor = req.query.color;
  const searchPriceAsc = req.query.sortAsc;
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  console.log(req.query);

  // Build SQL query based on search parameters
  let sql = 'SELECT * FROM product WHERE 1 = 1'; // Start with a 1=1 condition

  const values = [];

 
  if (searchBrand || searchColor || (minPrice && maxPrice)) {
    sql += ' AND (';
    if (searchBrand) {
      sql += ' title LIKE ?';
      values.push(`%${searchBrand}%`);
    }
    if (searchColor) {
      if (searchBrand) {
        sql += ' OR title LIKE ?';
      } else {
        sql += ' title LIKE ?';
      }
      values.push(`%${searchColor}%`);
    }
    if (minPrice && maxPrice) {
      if (searchBrand || searchColor) {
        sql += ' AND';
      }
      sql += ' newPrice >= ? AND newPrice <= ?';
      values.push(minPrice, maxPrice);
    }
    sql += ')';
  }

  // Apply sorting
  if (searchPriceAsc === '0') {
    sql += ' ORDER BY newPrice ASC';
  } else if (searchPriceAsc === '1') {
    sql += ' ORDER BY newPrice DESC';
  }

  // Apply pagination with placeholders
  sql += ' LIMIT ? OFFSET ?';
  values.push(perPage, (page - 1) * perPage);

  // Execute the query
  myDB.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error getting products: ' + err.message);
      res.status(500).send({ error: 'Error getting products' });
    } else {
      if (results.length === 0) {
        res.status(404).send({ error: 'No products found' });
      } else {
        res.status(200).json(results);
      }
    }
  });
});




productRouter.post('/addProduct', (req, res) => {
  //console.log(req.headers);
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' });
  }else{
    const token = authHeader.slice(7);
    const adminInfo=verifyToken(token)
    if(adminInfo.data.isAdmin===1){
      const { name, oldPrice,newPrice,category,imageLink, stock} = req.body.values;
    const productDetails = req.body.productDetails;
    const sql = 'INSERT INTO product (title, oldPrice,newPrice,category,image, stock,productDetails) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, oldPrice,newPrice,category,imageLink, stock , JSON.stringify(productDetails)];
  
    myDB.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error adding product: ' + err.message);
        res.status(200).send({error:'Error adding product'});
      } else {
        res.status(200).send({msg:'Product added successfully'});
      }
    });

    }else{
      res.status(200).send({error:'Only Admin can do this'});
    }

  }

    
  });
  
  //home product
  productRouter.get('/home/product', (req, res) => {
    //console.log('home product');
  // Build SQL query based on search parameters
    let sql = 'SELECT * FROM product LIMIT 10';
    // Execute the query
    myDB.query(sql, (err, results) => {
      if (err) {
        //console.error('Error getting products: ' + err.message);
        res.status(200).send({error:'Error getting products'});
      } else {
        if (results.length === 0) {
          res.status(200).send({error:'No products found'});
        } else {
          res.status(200).json(results);
        }
      }
    });
  });

  //top rated
  productRouter.get('/home/top-rated', (req, res) => {
    console.log('best product');
    // Build SQL query based on search parameters
    let sql = 'SELECT * FROM product WHERE rating > 3 LIMIT 10';
    // Execute the query
    myDB.query(sql, (err, results) => {
        if (err) {
            res.status(200).send({ error: 'Error getting products' });
        } else {
            if (results.length === 0) {
                res.status(200).send({ error: 'No products found' });
            } else {
                res.status(200).json(results);
            }
        }
    });
});

//client review post
// productRouter.post('/add/review/:id', (req, res) => {
//   const productId = req.params.id;
//   const review = req.body?.values?.review;
//   const authHeader = req.headers['authorization'];
  
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(200).json({ error: 'No valid token provided' });
//   }else{
//     const token = authHeader.slice(7);
//     const userInfo=verifyToken(token)

//     const cusReview={
//       review:review,
//       userName:userInfo?.data?.name,
//       userEmail:userInfo?.data?.email
//     }
//     console.log(productId);
//     // Define the SQL query to add a review to the product
//   const sql = 'UPDATE product SET review = JSON_ARRAY_APPEND(review, "$", ?) WHERE id = ?';
//   const values = [JSON.stringify(cusReview), productId];
  

//   myDB.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error updating product: ' + err.message);
//       res.status(200).send({error:'Error updating product'});
//     } else {
//       if (result.affectedRows === 0) {
//         res.status(200).send({error:'Product not found'});
//       } else {
//         console.log(result);
//         res.status(200).send({msg:'Product updated successfully'});
//       }
//     }
//   });
    
//   }

  
// });

productRouter.post('/add/review/:id', (req, res) => {
  const productId = req.params.id;
  const review = req.body?.values?.review;
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' }); // Changed the status code to 401 (Unauthorized)
  } else {
    const token = authHeader.slice(7);
    const userInfo = verifyToken(token);

    if (!userInfo || !userInfo.data) {
      return res.status(401).json({ error: 'Invalid token' }); // Handle invalid or missing user information
    }

    const cusReview = {
      review: review,
      userName: userInfo.data.name,
      userEmail: userInfo.data.email,
    }

    console.log('Product ID:', productId);
    console.log('Customer Review:', cusReview);

    // Define the SQL query to add a review to the product
    const sql = 'UPDATE product SET review = JSON_INSERT(review, "$.reviews[0]", ?) WHERE id = ?';
    const values = [JSON.stringify(cusReview), productId];

    myDB.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating product: ' + err.message);
        res.status(500).json({ error: 'Error updating product' }); // Changed the status code to 500 (Internal Server Error)
      } else {
        if (result.affectedRows === 1) {
          console.log('Product updated successfully');
          res.status(200).json({ msg: 'Product updated successfully' });
        } else {
          console.log('Product not found');
          res.status(404).json({ error: 'Product not found' }); // Changed the status code to 404 (Not Found)
        }
      }
    });
  }
});





  // Get a product by ID
  productRouter.get('/getProduct/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM product WHERE id = ?';
  console.log(productId);
    myDB.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error getting product: ' + err.message);
        res.status(200).send({error:'Error getting product'});
      } else {
        if (result.length === 0) {
          res.status(200).send({error:'Product not found'});
        } else {
          res.status(200).json(result[0]);
        }
      }
    });
  });
  
  // Delete a product by ID
  productRouter.delete('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM product WHERE id = ?';
  
    myDB.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting product: ' + err.message);
        res.status(500).send('Error deleting product');
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Product not found');
        } else {
          res.status(200).send('Product deleted successfully');
        }
      }
    });
  });
  
  // Update a product by ID
  productRouter.put('/updateProduct/:id', (req, res) => {
    const productId = req.params.id;
    const { title, price,status, rating, stock, review, productDetails, image } = req.body;
    const sql = 'UPDATE product SET title = ?, price = ?, rating = ?, stock = ?, review = ?, productDetails = ?, image = ? WHERE id = ?';
    const values = [title,status, price, rating, stock, JSON.stringify(review), JSON.stringify(productDetails), image, productId];
  
    myDB.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating product: ' + err.message);
        res.status(500).send('Error updating product');
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Product not found');
        } else {
          res.status(200).send('Product updated successfully');
        }
      }
    });
  });

  module.exports=productRouter