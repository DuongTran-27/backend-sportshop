require('../utils/MongooseUtil');
const Models = require('./Models');

const UserDAO ={
    async readAll() {
        const users = await Models.User.find({}).exec();
        return users;
    },
    async readById(id) {
        const user = await Models.User.findById(id).exec();
        return user;
    },
    async create(newUser) {
        const result = await Models.User.create(newUser);
        return result;
    },
    async update(id, user) {
        const result = await Models.User.findByIdAndUpdate(id, user, { new: true }).exec();
        return result;
    },
    async delete(id) {
        const result = await Models.User.findByIdAndDelete(id);
        return result;
    }
}
module.exports = UserDAO;