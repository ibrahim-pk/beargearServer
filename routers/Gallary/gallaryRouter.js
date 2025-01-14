const express=require('express');
const myDB = require('../../DB/db');

const gallaryRouter=express.Router()


gallaryRouter.post('/add', (req, res) => {
  const title = req.body?.values?.title;
  const imageLink = req.body?.values?.imageLink;
 // console.log(req.body);
  const sql = 'INSERT INTO gallary (title, imageLink) VALUES (?, ?)';
    try{
        myDB.query(sql, [title, imageLink], (err, results) => {
            if (err) {
               console.error('Error creating logo:', err);
               res.status(500).json({ error: 'Error creating logo' });
            } else {
               res.status(201).json({ msg:'Added logo' });
            }
         });
    }catch(err){
        res.status(500).json({ error: 'Error adding logo' });
    }

});

  
  // Get all order categories
  gallaryRouter.get('/get', (req, res) => {
    try{
      myDB.query('SELECT * FROM gallary', (err, results) => {
        if (err) {
          console.error('Error getting logo:', err);
          res.status(500).json({ error: 'Error getting logo' });
        } else {
          res.status(200).json(results);
        }
      });
    }catch(error){
      res.status(500).json({ error: 'Error getting logo' });
    }
  });
  

  
  // Delete an order banner by ID
  gallaryRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    try{
        myDB.query('DELETE FROM gallary WHERE id = ?', [id], (err) => {
            if (err) {
              console.error('Error deleting logo:', err);
              res.status(200).json({ error: 'Error deleting logo' });
            } else {
              res.status(200).json({msg:'Delete Sucessfuly'});
            }
          });
    }catch(err){
        res.status(200).json({ error: 'Error deleting logo' });
    }
  });

  module.exports=gallaryRouter;