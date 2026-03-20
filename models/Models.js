// CLI: npm install mongoose --save
const mongoose = require('mongoose');


// ===== SCHEMAS =====
const AdminSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false }
);

const CategorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    slug: String,
    description: String,
    image: String,
    gender: String,
    cdate: Number,
  },
  { versionKey: false }
);

const UserSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    full_name: String,
    password: String,
    phone: String,
    address: Object,
    email: String,
    role: String,
    wishlist: [String],
    cdate: Number,
    active: Number,
    token: String
  },
  { versionKey: false }
);

const ProductSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    cdate: Number,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    details: Object,
  },
  { versionKey: false }
);

const CartsSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    user_id: String,
    items: [Object],
    updatedAt: Number,
  },
  {
    versionKey: false
  }
);

const OrderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    orderNumber: String,
    cdate: Number,
    totalAmount: Number,
    status: String,
    paymentMethod: String,
    shippingInfo: Object,
    items: [Object],
  },
  { versionKey: false }
);

// ===== MODELS =====
// Register Admin model and explicitly set collection name to 'admin'
// This prevents Mongoose's default pluralization which created 'admins'.
const Admin = mongoose.model('Admin', AdminSchema, 'admin');
const Category = mongoose.model('Category', CategorySchema);
const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Cart = mongoose.model('Cart', CartsSchema);


module.exports = {
  Admin,
  Category,
  User,
  Product,
  Order,
  Cart
};
