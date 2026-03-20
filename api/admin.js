const express = require('express');
const router = express.Router();

const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');

// --- Category routes ---
router.get('/categories', async (req, res) => {
	try {
		const categories = await CategoryDAO.selectAll();
		res.json(categories);
	} catch (err) {
        
		console.error('GET /categories error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/categories/:id', async (req, res) => {
	try {
		const category = await CategoryDAO.selectById(req.params.id);
		if (!category) return res.status(404).json({ error: 'Category not found' });
		res.json(category);
	} catch (err) {
		console.error('GET /categories/:id error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/categories', async (req, res) => {
	try {
		const payload = req.body;
		const created = await CategoryDAO.insert(payload);
		res.status(201).json(created);
	} catch (err) {
		console.error('POST /categories error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.put('/categories/:id', async (req, res) => {
	try {
		const updated = await CategoryDAO.update(req.params.id, req.body);
		if (!updated) return res.status(404).json({ error: 'Category not found' });
		res.json(updated);
	} catch (err) {
		console.error('PUT /categories/:id error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.delete('/categories/:id', async (req, res) => {
	try {
		await CategoryDAO.delete(req.params.id);
		res.status(204).end();
	} catch (err) {
		console.error('DELETE /categories/:id error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// --- Product routes ---
router.get('/products', async (req, res) => {
	try {
		const products = await ProductDAO.selectAll();
		res.json(products);
	} catch (err) {
		console.error('GET /products error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/products/:id', async (req, res) => {
	try {
		const product = await ProductDAO.selectById(req.params.id);
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.json(product);
	} catch (err) {
		console.error('GET /products/:id error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/products', async (req, res) => {
	try {
		const created = await ProductDAO.insert(req.body);
		res.status(201).json(created);
	} catch (err) {
		console.error('POST /products error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.put('/products/:id', async (req, res) => {
	try {
		const updated = await ProductDAO.update(req.params.id, req.body);
		if (!updated) return res.status(404).json({ error: 'Product not found' });
		res.json(updated);
	} catch (err) {
		console.error('PUT /products/:id error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.delete('/products/:id', async (req, res) => {
	try {
		await ProductDAO.delete(req.params.id);
		res.status(204).end();
	} catch (err) {
		console.error('DELETE /products/:id error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// --- Order routes ---
router.get('/orders', async (req, res) => {
    try {
        const orders = await OrderDAO.selectAll();
        res.json(orders);
    } catch (err) {
        console.error('GET /orders error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const order = await OrderDAO.selectById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('GET /orders/:id error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/orders', async (req, res) => {
    try {
        const created = await OrderDAO.insert(req.body);
        res.status(201).json(created);
    } catch (err) {
        console.error('POST /orders error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/orders/:id', async (req, res) => {
    try {
        const updated = await OrderDAO.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: 'Order not found' });
        res.json(updated);
    } catch (err) {
        console.error('PUT /orders/:id error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/orders/:id', async (req, res) => {
    try {
        await OrderDAO.delete(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('DELETE /orders/:id error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

