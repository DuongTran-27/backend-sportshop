const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server !' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

