const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser')
const {DB_USER, DB_PASSWORD, DB_NAME, API_KEY, PORT, DB_URL} = process.env
const mongoose = require('mongoose');
const app = express();
app.listen(PORT, () => {
    console.log('Server listening on ' + PORT);
});

// URL de connexion à MongoDB
const uri = DB_URL;

mongoose.connect(uri, {
    useNewUrlParser: true, // Options de connexion supplémentaires si nécessaire
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


//// routes
const userRouter = require('./routers/userRouter').router
const authRouter = require('./routers/authRouter').router
const taskRouter = require('./routers/taskRouter').router

app.use(bodyParser.json())

app.use('/', userRouter)
app.use('/', authRouter)
app.use('/', taskRouter)