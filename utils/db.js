const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.lzase.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, { dbName: process.env.DB_NAME })
.then(() => console.log(`MongoDB Connected!`))
.catch(err => console.log(err));

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    .then(() => console.log(`\nMongoDB connection closed!`))
    .catch(err => console.log(err));
    process.exit(0);
});