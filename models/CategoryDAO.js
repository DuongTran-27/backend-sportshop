require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CategoryDAO = {
    async selectAll() {
        const query = {};
        const categories = await Models.Category.find(query).exec();
        return categories;
    },
    
    async selectById(id) {
        const query = { _id: id };
        const category = await Models
        .Category.findOne(query).exec();
        return category;
    },

    async insert(category) {
        const newCategory = new Models.Category({
            _id: new mongoose.Types.ObjectId(),
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            gender: category.gender,
            cdate: category.cdate
        });
        await newCategory.save();
        return newCategory;
    },
    async update(id, category) {
        const query = { _id: id };
        const update = {
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            gender: category.gender,
            cdate: category.cdate
        };
        const options = { new: true };
        const updatedCategory = await Models.Category.findOneAndUpdate(query, update, options).exec();
        return updatedCategory;
    },
    async delete(id) {
        const query = { _id: id };
        await Models.Category.deleteOne(query).exec();
    }




};

module.exports = CategoryDAO;