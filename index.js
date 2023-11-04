const express = require('express');
const authRouter = require('./routers/auth/authRouter');
const cors=require('cors');
const myDB = require('./DB/db');
const orderRouter = require('./routers/order/orderRouter');
const productRouter = require('./routers/product/ProductRouter');
const categoryRouter = require('./routers/category/categoryRouter');

const app = express();
const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// Connect to MySQL
myDB.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});


app.use('/api/v1/user',authRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/category',categoryRouter)




app.get('/', (req, res) => {
  res.send('Hello BG Server!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
