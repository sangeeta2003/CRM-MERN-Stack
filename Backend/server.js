const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Product = require('./models/Product'); 
const User = require('./models/User');
const Contact = require('./models/Contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/products')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, passwordHash });
        return res.status(201).json({ id: user._id, email: user.email });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { sub: user._id.toString(), email: user.email },
            process.env.JWT_SECRET || 'dev_secret',
            { expiresIn: '7d' }
        );
        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

app.post('/api/products', requireAuth, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        console.log('Product added:', savedProduct);
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/products/:id', requireAuth, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log('Product updated:', updatedProduct);
        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ message: err.message });
    }
});

app.get('/api/products', requireAuth, async (req, res) => {
    try {
        const products = await Product.find();
        console.log('Products retrieved:', products);
        res.json(products);
    } catch (err) {
        console.error('Error retrieving products:', err);
        res.status(500).json({ message: err.message });
    }
});

// Retrieve a specific product by ID
app.get('/api/products/:id', requireAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error retrieving product:', err);
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/products/:id', requireAuth, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete all products
app.delete('/api/products', requireAuth, async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: 'All products deleted successfully' });
    } catch (err) {
        console.error('Error deleting all products:', err);
        res.status(500).json({ message: err.message });
    }
});

// Contacts CRUD
app.post('/api/contacts', requireAuth, async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/api/contacts', requireAuth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/contacts/:id', requireAuth, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/contacts/:id', requireAuth, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(contact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/contacts/:id', requireAuth, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Dashboard summary
app.get('/api/dashboard/summary', requireAuth, async (req, res) => {
    try {
        const [totalProducts, totalContacts, totalRevenueAgg, profitAgg] = await Promise.all([
            Product.countDocuments(),
            Contact.countDocuments(),
            Product.aggregate([{ $group: { _id: null, revenue: { $sum: { $multiply: ['$price', '$quantity'] } } } }]),
            Product.aggregate([{ $group: { _id: null, profit: { $sum: { $multiply: [{ $subtract: ['$price', '$netPrice'] }, '$quantity'] } } } }])
        ]);
        const totalRevenue = totalRevenueAgg[0]?.revenue || 0;
        const totalProfit = profitAgg[0]?.profit || 0;
        res.json({ totalProducts, totalContacts, totalRevenue, totalProfit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
