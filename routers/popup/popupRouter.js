// Import required modules
const express = require('express');
const myDB = require('../../DB/db');



const popupRouter=express.Router()


// GET all rows
popupRouter.get('/get', (req, res) => {
   try{
    myDB.query('SELECT * FROM popup', (error, results) => {
      
      res.status(200).send(results);
    });
   }catch(err){
    res.status(200).send(err.message);
   }
});

 // POST a new row
// popupRouter.post('/add', (req, res) => {
//   const { title, imageLink, category, productId } = req.body;
//   myDB.query(
//     'INSERT INTO popup (title, imageLink, category, productId, date) VALUES (?, ?, ?, ?, NOW())',
//     [title, imageLink, category, productId],
//     (error, results) => {
//       if (error) throw error;
//       res.json({ id: results.insertId });
//     }
//   );
// });

// UPDATE a row by ID
popupRouter.put('/:id', (req, res) => {
  try{
    const id = req.params.id;
  console.log(req.body);
  const { title, imageLink, category, productId } = req.body;
  myDB.query(
    'UPDATE popup SET title=?, imageLink=?, category=?, productId=? WHERE id=?',
    [title, imageLink, category, productId, id],
    (error) => {
      if (error){
      res.status(200).json({ error: 'Updated successfully' });
         
      }
      else{
      res.status(200).json({ message: 'Updated successfully' });
        
      }
    }
  );
  }catch(err){
    console.log(err);
  }
});

// DELETE a row by ID
// popupRouter.delete('/:id', (req, res) => {
//   const id = req.params.id;
//   myDB.query('DELETE FROM popup WHERE id=?', [id], (error) => {
//     if (error) throw error;
//     res.json({ message: 'Deleted successfully' });
//   });
// });


module.exports=popupRouter
