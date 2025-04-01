const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    next();
});


// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

// API routes
app.get('/', (req, res) => {
    res.send('Server is running, and the database connection is established!');
});

// Register and login routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/', require('./routes/products'));
app.use('/api/products/', require('./routes/imageUpload'));
app.use('/api/', require('./routes/ordersApi'));
app.use('/api/', require('./routes/user'));
app.use('/api/admin', require("./routes/admin"));
app.use('/api/', require('./routes/aipowered'));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});