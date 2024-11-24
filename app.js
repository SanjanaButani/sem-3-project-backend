const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const cors = require('cors');

const port = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

const db = require('./utils/db');

const userRoute = require('./routes/User.routes');
const adminRoute = require('./routes/Admin.routes');

app.use('/user', userRoute);

app.use('/admin', adminRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status = err.status || 500;
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

app.listen(port, () => {
    console.log(`Backend started on port: ${port}`);
});