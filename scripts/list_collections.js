// List MongoDB collections and counts
require('../utils/MongooseUtil');
const mongoose = require('mongoose');

async function listCollections() {
  const conn = mongoose.connection;
  if (conn.readyState !== 1) {
    await new Promise((res) => conn.once('open', res));
  }
  const db = conn.db;
  const cols = await db.listCollections().toArray();
  console.log('Collections in DB:', cols.map(c => c.name).join(', '));
  for (const c of cols) {
    try {
      const count = await db.collection(c.name).countDocuments();
      console.log(`${c.name}: ${count} documents`);
    } catch (err) {
      console.error('Error counting', c.name, err.message || err);
    }
  }
  process.exit(0);
}

listCollections().catch(err => {
  console.error('Script error:', err);
  process.exit(2);
});
