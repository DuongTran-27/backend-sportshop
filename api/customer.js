const express = require('express');
const router = express.Router();

//daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');

// =============================================
// CATEGORY ROUTES
// =============================================

//  Lấy danh sách tất cả danh mục
router.get('/categories', async (req, res) => {
    try {
        const categories = await CategoryDAO.selectAll();
        res.json(categories);
    } catch (err) {
        console.error('GET /categories error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Xem chi tiết 1 danh mục theo ID
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await CategoryDAO.selectById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        console.error('GET /api/customer/categories/:id error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =============================================
// PRODUCT ROUTES
// =============================================

//  Lấy danh sách tất cả sản phẩm
router.get('/products', async (req, res) => {
    try {
        const products = await ProductDAO.selectAll();
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//  Lấy sản phẩm mới nhất 
router.get('/products/new', async (req, res) => {
    try {
        const top = parseInt(req.query.top) || 3;
        const products = await ProductDAO.selectAll();
        res.json(products.slice(0, top));
    } catch (err) {
        console.error('GET /api/customer/products/new error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Tìm kiếm sản phẩm 
router.get('/products/search/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const products = await ProductDAO.search(keyword);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/search/:keyword error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Lấy sản phẩm theo danh mục
router.get('/products/categories/:cid', async (req, res) => {
    try {
        const _cid = req.params.cid;
        const products = await ProductDAO.selectByCategory(_cid);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/categories/:cid error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Xem chi tiết 1 sản phẩm theo ID
router.get('/products/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const product = await ProductDAO.selectById(_id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('GET /api/customer/products/:id error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// ORDER ROUTES
// =============================================

//  Lấy tất cả đơn hàng của 1 khách hàng
router.get('/orders/customer/:cid', async (req, res) => {
    try {
        const _cid = req.params.cid;
        const orders = await OrderDAO.selectByCustomer(_cid);
        res.json(orders);
    } catch (err) {
        console.error('GET /api/customer/orders/customer/:cid error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Xem chi tiết 1 đơn hàng theo ID
router.get('/orders/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const order = await OrderDAO.selectById(_id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('GET /api/customer/orders/:id error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Tạo đơn hàng mới 
router.post('/orders', async (req, res) => {
    try {
        const order = req.body;
        if (!order.userId || !order.items || order.items.length === 0) {
            return res.status(400).json({ error: 'userId và items là bắt buộc' });
        }
        const newOrder = await OrderDAO.insert(order);
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('POST /api/customer/orders error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Xoá đơn hàng 
router.delete('/orders/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const existing = await OrderDAO.selectById(_id);
        if (!existing) return res.status(404).json({ error: 'Order not found' });
        await OrderDAO.delete(_id);
        res.json({ message: 'Đơn hàng đã được xoá thành công' });
    } catch (err) {
        console.error('DELETE /api/customer/orders/:id error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;