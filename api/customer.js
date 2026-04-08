const express = require('express');
const router = express.Router();
const JwtUtil = require('../utils/JwtUtil');
const CryptoUtil = require('../utils/CryptoUtil');
const mongoose = require('mongoose');
const EmailUtil = require('../utils/EmailUtil');
const Models = require('../models/Models');




//daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const UserDAO = require('../models/UserDAO');

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

// Xem chi tiết 1 danh mục theo ID hoặc Slug
router.get('/categories/:id', async (req, res) => {
    try {
        const idOrSlug = req.params.id;
        let category;
        if (mongoose.Types.ObjectId.isValid(idOrSlug) && (String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug)) {
            category = await CategoryDAO.selectById(idOrSlug);
        } else {
            category = await CategoryDAO.selectBySlug(idOrSlug);
        }
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
        let categoryId = _cid;
        if (!mongoose.Types.ObjectId.isValid(_cid) || (String(new mongoose.Types.ObjectId(_cid)) !== _cid)) {
            const category = await CategoryDAO.selectBySlug(_cid);
            if (category) {
                categoryId = category._id;
            } else {
                return res.json([]);
            }
        }
        const products = await ProductDAO.selectByCategory(categoryId);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/categories/:cid error', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Xem chi tiết 1 sản phẩm theo ID hoặc Slug
router.get('/products/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        let product;
        if (mongoose.Types.ObjectId.isValid(_id) && (String(new mongoose.Types.ObjectId(_id)) === _id)) {
            product = await ProductDAO.selectById(_id);
        } else {
            product = await ProductDAO.selectBySlug(_id);
        }
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

        // Gửi email xác nhận đơn hàng (async, không block response)
        try {
            const user = await UserDAO.readById(order.userId);
            if (user && user.email) {
                const EmailUtil = require('../utils/EmailUtil');
                EmailUtil.sendOrderConfirmation(user.email, newOrder)
                    .then(sent => {
                        if (sent) console.log('Order confirmation email sent to', user.email);
                        else console.warn('Failed to send order confirmation email');
                    })
                    .catch(err => console.error('Email send error:', err));
            }
        } catch (emailErr) {
            console.error('Error sending order confirmation email:', emailErr);
            // Không throw — đơn hàng vẫn được tạo thành công
        }

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
// customer: activate account
router.post('/active', async function (req, res) {
        try {
                const _id = req.body.id;
                const token = req.body.token;
                if (!_id || !token) return res.status(400).json({ success: false, message: 'Missing id or token' });

                const result = await UserDAO.active(_id, token);
                if (result) res.json({ success: true, message: 'Account activated' });
                else res.status(400).json({ success: false, message: 'Invalid id or token' });
        } catch (err) {
                console.error('POST /api/customer/active error:', err);
                res.status(500).json({ error: 'Server error' });
        }
});
// customer: signup
router.post('/signup', async function (req, res) {
    try {
        console.log('POST /api/customer/signup body:', req.body);

        // normalize inputs
        const full_name = req.body.full_name;
        const password = req.body.password;
        const phone = req.body.phone;
        const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    const dbCust = await UserDAO.readByEmail(email);

        if (dbCust) {
            return res.json({ success: false, message: 'Exists email' });
        }

        const now = new Date().getTime(); // milliseconds
        const token = CryptoUtil.md5(now.toString());

        const newUser = new Models.User({
                _id: new mongoose.Types.ObjectId(),
                full_name: full_name,
                password: password,
                phone: phone,
                address: {
                    street: '',
                    ward: '',
                    district: '',
                    city: '',
                },
                email: email,
                role: "customer",
                wishlist: [],
                cdate: Date.now(),
                active: false,
                token: token
            });


        const result = await UserDAO.create(newUser);

        if (result) {
            const send = await EmailUtil.send(email, result._id, token);
            
            if (send) {
                return res.json({ 
                    success: true, 
                    message: 'Create success, please check email',
                    data: result
                });
            } else {
                res.json({ success: false, message: 'Email failure' });
            }
        } else {
            res.json({ success: false, message: 'Create failure' });
        }
    } catch (err) {
        console.error('POST /api/customer/signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// customer
router.post('/login', async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    const customer = await UserDAO.readByEmailAndPassword(email, password);

        if (customer) {
            if (customer.active === 1) {
                // generate token including username and password (keeps same shape as admin token)
                const token = JwtUtil.genToken(email, password);

                res.json({
                    success: true,
                    message: 'Authentication successful',
                    token: token,
                    customer: customer
                });
            } else {
                res.json({ success: false, message: 'Account is deactive' });
            }
        } else {
      res.json({ success: false, message: 'Incorrect email or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input email and password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
});

router.get('/user/:id', async function (req, res) {
    const user = await UserDAO.readById(req.params.id);
    return res.json({ 
        success: true, 
        data: user
    });
});
router.put('/user/:id', async function (req, res) {
      const _id = req.params.id;
      try{
        const full_name = req.body && req.body.full_name ? req.body.full_name.trim() : '';
        const password = req.body && req.body.password ? req.body.password.trim() : '';
        const phone = req.body && req.body.phone ? req.body.phone.trim() : '';
        const email = req.body && req.body.email ? req.body.email.trim() : '';
        const address = req.body && req.body.address ? req.body.address : {};
        const role = 'customer';

        if(!full_name) {
            return res.json({ 
                success: false, 
                message: 'full_name is required',
            });
        }
        if(!phone) {
            return res.json({ 
                success: false, 
                message: 'phone is required',
            });
        }
        if(!email) {
            return res.json({ 
                success: false,
                message: 'email is required',
            });
        }
        if(!address) {
            return res.json({ 
                success: false,
                message: 'address is required',
            });
        }

        if (!(full_name && phone && email && address)) {
            return res.json({ 
                success: false, 
                message: 'Missing required fields', 
                data: {
                    full_name,
                    password,
                    phone,
                    email,
                    address
                }
            });
        }
        let prod = {};
        if (password !== '') {
            prod = {_id, full_name, password, phone, email, address, role};
        } else {
            prod = {_id, full_name, phone, email, address, role};
        }

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
module.exports = router;