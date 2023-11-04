const express = require('express')
const bcrypt=  require('bcrypt');
const myDB = require('../../DB/db.js');
const { createToken, verifyToken } = require('../../jwt/jwt.js');

const authRouter=express.Router()

authRouter.post('/register',(req,res)=>{
    const { fullName, email, password } = req.body;
   //console.log(req.body);
  try{
   const isExistUser='SELECT * FROM user WHERE email=?'
   myDB.query(isExistUser,[email],(err,result)=>{
    if (err) {
      console.error('Error checking user:', err);
      res.status(200).json({ error: 'Internal Server Error' });
      return;
    }
    else if(result.length === 0){
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
    
        const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
        myDB.query(sql, [fullName, email, hash], (err, result) => {
          if (err) throw err;
         // console.log('User registered successfully');
         else{
          //console.log(result);
          const token=createToken(email)
          res.status(200).json({ msg: 'User registered successfully',token:token });

         }
        });
      });
    }else{
      res.status(200).json({ error: 'User already registered'});
    }
   })

  

  }catch(err){
    res.status(200).json({ error:err });

  }
  
})



authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    //console.log(req.body)
  
    // Check if the user with the provided email exists in the database
    const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
    myDB.query(checkUserQuery, [email], (err, results) => {
      if (err) {
       // console.error('Error checking user:', err);
        res.status(200).json({ error: 'Internal Server Error' });
        return;
      }
  
      // If the user does not exist, return an error message
      if (results.length === 0) {
        res.status(200).json({ error: 'Invalid email or password' });
        return;
      }
  
      const user = results[0];
  
      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.password, (bcryptErr, result) => {
        if (bcryptErr) {
         // console.error('Error comparing passwords:', bcryptErr);
          res.status(200).json({ error: 'Internal Server Error' });
          return;
        }
  
        // If the passwords match, return a success message
        if (result) {
          const token=createToken(user)
         // console.log(token)
          res.status(200).json({ msg: 'Login successful',token:token });
         // console.log(results)
        } else {
          // If the passwords don't match, return an error message
          res.status(200).json({ error: 'Invalid email or password' });
        }
      });
    });
  });

  authRouter.put('/update/:userId', (req, res) => {
    const userId = req.params.userId;
    const { name, email, password,token } = req.body;
   
  
    // Check if the user with the provided userId exists in the database
    const checkUserQuery = 'SELECT * FROM user WHERE id = ?';
    myDB.query(checkUserQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // If the user does not exist, return an error message
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      // Update user information
      else{
        const verifyUser=verifyToken(token)
         console.log(verifyUser);

      //   const updateUserQuery = 'UPDATE user SET name=?, email=?, password=? WHERE id=?';
      //  myDB.query(updateUserQuery, [name, email, password, userId], (err, result) => {
      //   if (err) {
      //     console.error('Error updating user:', err);
      //     res.status(500).json({ error: 'Internal Server Error' });
      //     return;
      //   }
      //   else{
      //     res.status(200).json({ message: 'User information updated successfully' });
      //   }
       
      // });
      }
    });
  });
  



  authRouter.delete('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
  
    // Check if the user with the provided userId exists in the database
    const checkUserQuery = 'SELECT * FROM user WHERE id = ?';
    myDB.query(checkUserQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // If the user does not exist, return an error message
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      // Delete user from the database
      const deleteUserQuery = 'DELETE FROM user WHERE id=?';
      myDB.query(deleteUserQuery, [userId], (err, result) => {
        if (err) {
          console.error('Error deleting user:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
      });
    });
  });
 
    

module.exports= authRouter;