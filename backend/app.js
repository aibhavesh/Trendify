import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/auth/loginRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import registerRoutes from './routes/auth/registerRoutes.js';
//import productRoutes from './routes/productRoutes.js';
//import categoryRoutes from './routes/categoryRoutes.js';
//import adminRoutes from './routes/adminRoutes.js';
//import contactRoutes from './routes/contactRoutes.js';
//import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth/login", loginRoutes);
app.use('/api/users', userRoutes);
app.use("/api/auth/register", registerRoutes);
//app.use('/api/products', productRoutes);
//app.use('/api/categories', categoryRoutes);
//app.use('/api/admin', adminRoutes);
//app.use('/api/contact', contactRoutes);
//app.use('/api/upload', uploadRoutes);


app.get('/', (req, res)=>{
    res.send('Server is up and running!');
});

export default app;