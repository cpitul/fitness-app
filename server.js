const express = require('express');
const app = express();
const connectDB = require('./database/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(express.json({ extended: false }));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/login', require('./routes/login'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => console.log('Server running...'));
