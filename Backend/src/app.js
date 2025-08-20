const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()
const userRoutes = require('./routes/user.routes');
const connectDB = require('./db/db');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const transactionRoutes = require('./routes/transaction.routes');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieparser());

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/user', userRoutes);
app.use('/transactions', transactionRoutes);

module.exports = app