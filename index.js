require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }));

const cors = require('cors');

// cho phép tất cả (dev thôi)
app.use(cors());

app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server !' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




