const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserDAO = require('../models/UserDAO');


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


module.exports = router;