const jwt = require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config()

const createToken = (data) => {
    try {
      const token = jwt.sign({ data: data }, process.env.secret_key, { expiresIn: '24h' });
      return token;
    } catch (err) {
      // Handle the error, e.g., log it or return an appropriate error message.
      //console.error('Error while creating token:', err);
      return null; // or throw an error
    }
  };
  


const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, process.env.secret_key);
      return decoded;
    } catch (err) {
      return { msg: 'Invalid User' };
    }
  };
  

module.exports={
    createToken,
    verifyToken
}