require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const ProductDAO = {
    async search(keyword) {
        const query = { name: { $regex: keyword, $options: 'i' } };
        const products = await Models.Product.find(query).exec();
        return products;
    },
    async selectAll() {
        const query = {};
        const products = await Models.Product.find(query).exec();
        return products;
    },
    async selectById(id) {
        const query = { _id: id };
        const product = await Models
        .Product.findOne(query).exec();
        return product;
    },
    async insert(product) {
        const newProduct = new Models.Product({
            _id: new mongoose.Types.ObjectId(),
            name: product.name,
            price: product.price,
            image: product.image,
            cdate: product.cdate,
            description: product.description,
            category: product.category,
            details: product.details
        });
        await newProduct.save();
        return newProduct;
    },
    async update(id, product) {
        const query = { _id: id };
        const update = {
            name: product.name,
            price: product.price,
            image: product.image,
            cdate: product.cdate,
            description: product.description,
            category: product.category,
            details: product.details
        };
        const options = { new: true };
        const updatedProduct = await Models.Product.findOneAndUpdate(query, update, options).exec();
        return updatedProduct;
    },
    async delete(id) {
        const query = { _id: id };
        await Models.Product.deleteOne(query).exec();
    }

};

module.exports = ProductDAO;