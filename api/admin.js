const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserDAO = require('../models/UserDAO');

const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');


router.get('/user', async function (req, res) {
    const users = await UserDAO.readAll();
    return res.json(
        users 
    );
});

router.get('/user/:id', async function (req, res) {
    const user = await UserDAO.readById(req.params.id);
    return res.json({ 
        success: true, 
        data: user
    });
});

router.post('/user', async function (req, res) {
    const newUser = new Models.User({
        _id: new mongoose.Types.ObjectId(),
        full_name: req.body.full_name,
        password: req.body.password,
        phone: req.body.phone,
        address: {},
        email: req.body.email,
        role: req.body.role,
        wishlist: [],
        cdate: Date.now(),
        active: true,
        token: req.body.token
    });
    const result = await UserDAO.create(newUser);

    return res.json({ 
        success: true, 
        data: result
    });
});

router.put('/user/:id', async function (req, res) {
      const _id = req.params.id;
      try{
         const full_name = req.body && req.body.full_name ? req.body.full_name.trim() : '';
            const password = req.body && req.body.password ? req.body.password.trim() : '';
            const phone = req.body && req.body.phone ? req.body.phone.trim() : '';
            const email = req.body && req.body.email ? req.body.email.trim() : '';
            const role = req.body && req.body.role ? req.body.role.trim() : '';

        if (!full_name || !password || !phone || !email || !role) {
            return res.json({ success: false, message: 'Missing required fields' });
        }
        const prod = {_id, full_name, password, phone, email, role};
        const result = await UserDAO.update(_id, prod);
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        else {
            return res.json({ success: true, data: result });
        }
      } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

router.delete('/user/:id', async function (req, res) {
    const result = await UserDAO.delete(req.params.id);
    if (!result) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }   
    else {
        return res.json({ success: true, data: result });
    }
});



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

