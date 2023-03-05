const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { unless } = require("express-unless");
const cron = require('node-cron');
const port = process.env.PORT || 3000


const auth = require('./helpers/jwt.js');
const users = require('./controllers/UserController.js')
const transformer = require('./controllers/TransformerDataController')
const nodeMCU = require('./controllers/NodeMCUDataController')
const errors = require('./helpers/errorHandler.js')
const logger = require('./logging/logger.js')

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json()) // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

// middleware for authenticating token submitted with requests
auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/', methods: ['GET']},
        { url: '/users/login', methods: ['POST']},
        { url: '/users/register', methods: ['POST']},
        { url: '/users/refreshToken', methods: ['POST']},
        { url: '/admin/login', methods: ['POST']},
        { url: '/transformer_data/properties/add', methods: ['POST']}
    ]
}))

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello World!"})
})
app.use('/users', users) // middleware for listening to routes
app.use('/transformer_data', transformer)
app.use('/nodemcu-data', nodeMCU)
app.use(errors.errorHandler); // middleware for error responses

// MongoDB connection, success and error event responses
const uri = process.env.DB_CONNECTION;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true });
const db = mongoose.connection;
db.on('error', () => logger.log.error('connection error:'));
db.once('open', () => logger.log.info(`Connected to mongo at ${uri}`));

app.listen(port, () => {
    logger.log.info(`Example app listening on port ${port}`)
})