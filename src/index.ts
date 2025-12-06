import express from 'express';
import cors from 'cors';
import { fetchProducts } from './shopify/index';
const app = express();
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import productRoutes from './routes/products';



app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/customers',customerRoutes);
app.use('/products',productRoutes);

const PORT = process.env.PORT ?  process.env.PORT : 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;