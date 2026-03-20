const express = require ('express');
const app = express ();
const PORT = 3000;



const bodyParser = require ('body-parser');
app.use(bodyParser.json ({linit: '10mb'}));
app.use(bodyParser.urlencoded ({extended: true, limit: '10mb'}));

app.get ('/', (req, res) => {
    res.json ({message:'Hello from server !' });
});

app.use('/api/admin', require('./api/admin.js'));

app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
});
