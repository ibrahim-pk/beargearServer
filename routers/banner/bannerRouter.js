const express=require('express');
const myDB = require('../../DB/db');

const bannerRouter=express.Router()

bannerRouter.post('/add', (req, res) => {
  const title = req.body?.values?.title;
  const imageLink = req.body?.values?.imageLink;
 // console.log(req.body);
  const sql = 'INSERT INTO banner (title, imageLink) VALUES (?, ?)';
    try{
        myDB.query(sql, [title, imageLink], (err, results) => {
            if (err) {
              // console.error('Error creating banner:', err);
               res.status(200).json({ error: 'Error creating banner' });
            } else {
               res.status(200).json({ msg:'Added banner' });
            }
         });
    }catch(err){
        res.status(200).json({ error: 'Error adding banner' });
    }

});

  
  // Get all order categories
  bannerRouter.get('/get', (req, res) => {
    try{
      myDB.query('SELECT * FROM banner', (err, results) => {
        if (err) {
          //console.error('Error getting banner:', err);
          res.status(200).json({ error: 'Error getting banner' });
        } else {
          res.status(200).json(results);
        }
      });
    }catch(error){
      res.status(200).json({ error: 'Error getting categories' });
    }
  });
  

  
  // Delete an order banner by ID
  bannerRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
   // console.log(id);
    try{
        myDB.query('DELETE FROM banner WHERE id = ?', [id], (err) => {
            if (err) {
              console.error('Error deleting banner:', err);
              res.status(200).json({ error: 'Error deleting banner' });
            } else {
              res.status(200).json({msg:'Delete Sucessfuly'});
            }
          });
    }catch(err){
        res.status(200).json({ error: 'Error deleting banner' });
    }
  });

  module.exports=bannerRouter;