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
    },
    async readByEmail(email) {
        const user = await Models.User.findOne({ email: email }).exec();
        return user;    
    },
    async readByEmailAndPassword(email, password) {
        const user = await Models.User.findOne({ email: email, password: password }).exec();
        return user;
    },
    async active(_id, token) {
    const query = { _id: _id, token: token };
    const newvalues = { active: 1 };

    const result = await Models.User.findOneAndUpdate(
      query,
      newvalues,
      { new: true }
    );

    return result;
  },
}
module.exports = UserDAO;