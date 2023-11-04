const express=require('express');
const myDB = require('../../DB/db');

const categoryRouter=express.Router()

categoryRouter.post('/add', (req, res) => {
   //console.log(req.body);
    const category = req.body.categoryName;
    const sql = 'INSERT INTO category (category) VALUES (?)'; // Specify the column name you want to insert into
  
    myDB.query(sql, [category], (err, results) => {
      if (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Error creating category' });
      } else {
        res.status(201).json({ msg:'Added Category' });
      }
    });
  });
  
  // Get all order categories
  categoryRouter.get('/get', (req, res) => {
    myDB.query('SELECT * FROM category', (err, results) => {
      if (err) {
        console.error('Error getting categories:', err);
        res.status(500).json({ error: 'Error getting categories' });
      } else {
        res.status(200).json(results);
      }
    });
  });
  
  // Update an order category by ID
  categoryRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const category = req.body.category;
    myDB.query('UPDATE category SET category = ? WHERE id = ?', [category, id], (err) => {
      if (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Error updating category' });
      } else {
        res.status(200).json({ id: id, category: category });
      }
    });
  });
  
  // Delete an order category by ID
  categoryRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    myDB.query('DELETE FROM category WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error deleting category:', err);
        res.status(200).json({ error: 'Error deleting category' });
      } else {
        res.status(200).json({msg:'Delete Sucessfuly'});
      }
    });
  });

  module.exports=categoryRouter;