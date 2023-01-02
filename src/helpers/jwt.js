const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const logger = require('../logging/logger.js')
const User = require('../models/UserModel')

// get password vars from .env file
dotenv.config();



function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify (token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403)
        
        req.user = user
        next()

       
    })
}

function generateAccessToken(email) {
    return jwt.sign({data: email}, process.env.TOKEN_SECRET, { expiresIn: '96h' });
}

module.exports = {
    authenticateToken,
    generateAccessToken
}



