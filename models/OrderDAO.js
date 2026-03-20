require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');
const {selectById} = require("./CategoryDAO");


const OrderDAO = {
  async selectAll() {
    const query = {};
    const orders = await Models.Order.find(query).exec();
    return orders;
  },
  async selectById(id) {
    const query = { _id: id };
    const order = await Models.Order.findOne(query).exec();
    return order;
  },
  async insert(order) {
    const newOrder = new Models.Order({
      _id: new mongoose.Types.ObjectId(),
      userId: order.userId,
      orderNumber: order.orderNumber,
      cdate: order.cdate || Date.now(),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingInfo: order.shippingInfo,
      items: order.items || []
    });
    await newOrder.save();
    return newOrder;
  },
  async update(id, order) {
    const query = { _id: id };
    const update = {
      userId: order.userId,
      orderNumber: order.orderNumber,
      cdate: order.cdate,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingInfo: order.shippingInfo,
      items: order.items
    };
    const options = { new: true };
    const updatedOrder = await Models.Order.findOneAndUpdate(query, update, options).exec();
    return updatedOrder;
  },
  async selectByCustomer(userId) {
    const orders = await Models.Order.find({ userId: userId }).exec();
    return orders;
  },
  async delete(id) {
    const query = { _id: id };
    await Models.Order.deleteOne(query).exec();
  }
};

module.exports = OrderDAO;
