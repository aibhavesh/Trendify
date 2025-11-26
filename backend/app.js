import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/auth/loginRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import registerRoutes from './routes/auth/registerRoutes.js';
import productRoutes from './routes/product/productRoutes.js';
//import categoryRoutes from './routes/categoryRoutes.js';
//import adminRoutes from './routes/adminRoutes.js';
//import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/utils/uploadRoutes.js';

dotenv.config();

const app = express();
import cartRoutes from "./routes/cart/cartRoutes.js";
app.use("/api/cart", cartRoutes);

app.use(cors());
app.use(express.json());


app.use("/api/auth/login", loginRoutes);
app.use('/api/users', userRoutes);
app.use("/api/auth/register", registerRoutes);
app.use('/api/products', productRoutes);
//app.use('/api/categories', categoryRoutes);
//app.use('/api/admin', adminRoutes);
//app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
import orderRoutes from "./routes/order/orderRoutes.js";
app.use("/api/orders", orderRoutes);
import wishlistRoutes from "./routes/wishlist/wishlistRoutes.js";
app.use("/api/wishlist", wishlistRoutes);
import reviewRoutes from "./routes/review/reviewRoutes.js";
app.use("/api/reviews", reviewRoutes);


//payment gateway routes
//import paymentRoutes from "./routes/payment/paymentRoutes.js";
//app.use("/api/payment", paymentRoutes);


app.get('/', (req, res)=>{
    res.send('Server is up and running!');
});

export default app;