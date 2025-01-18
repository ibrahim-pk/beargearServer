const express = require('express');
const authRouter = require('./routers/auth/authRouter');
const cors=require('cors');
const myDB = require('./DB/db');
const orderRouter = require('./routers/order/orderRouter');
const productRouter = require('./routers/product/ProductRouter');
const categoryRouter = require('./routers/category/categoryRouter');
const popupRouter = require('./routers/popup/popupRouter');
const multer =require('multer')
const path=require('path')
const fs = require('fs');
const bannerRouter = require('./routers/banner/bannerRouter');
const supportRouter = require('./routers/supportUS/supportRouter');
const gallaryRouter = require('./routers/Gallary/gallaryRouter');

const app = express();

const port =process.env.PORT || 5000;


// Connect to MySQL
myDB.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});


// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const uploadDirectory = path.join(process.cwd(), 'public/uploads');

// // Ensure the uploads directory exists
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

//upload
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: path.join(process.cwd(), 'public/uploads'),
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     },
//   }),
// });



// app.use((_req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');

//   next();
// });
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
app.use(express.json())



app.use('/api/v1/user',authRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/banner',bannerRouter)
app.use('/api/v1/gallary',gallaryRouter)
app.use('/api/v1/support',supportRouter)
app.use('/api/v1/popup',popupRouter)


// Success route
app.post("/api/user/success", async (req, res) => {
  const tran_id = req.body.tran_id;
  console.log("successUrl:",tran_id)
  // Update the order's payment status to true
  const sql = "UPDATE orders SET payment = true WHERE tran_id = ?";
  myDB.query(sql, [tran_id], (err, result) => {
    if (err) {
      console.error("Error updating order payment status:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.redirect(`http://localhost:3000/payment/order-msg`);
  });
});

// Fail route
app.post("/api/user/fail", async (req, res) => {
  const tran_id = req.body.tran_id;

  // Delete the order based on tran_id
  const sql = "DELETE FROM orders WHERE tran_id = ?";
  myDB.query(sql, [tran_id], (err, result) => {
    if (err) {
      console.error("Error deleting failed order:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.redirect("http://localhost:3000/");
  });
});

// Cancel route
app.post("/api/user/cancel", async (req, res) => {
  const tran_id = req.body.tran_id;

  // Delete the order based on tran_id
  const sql = "DELETE FROM orders WHERE tran_id = ?";
  myDB.query(sql, [tran_id], (err, result) => {
    if (err) {
      console.error("Error deleting canceled order:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.redirect("http://localhost:3000/");
  });
});

// app.post('/api/upload',(req,res)=>{
//   try {
//      upload.single('file')(req, res, (err) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }

//       const filePath = req.file.path;
//       const fileUrl = `/uploads/${req.file.filename}`;

//       return res.status(200).json({ url: fileUrl });
//     });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }

// })




app.get('/', (req, res) => {
  res.send('Hello BG Server!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
