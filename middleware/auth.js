const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            req.user = jwt.verify(token, process.env.SECRET_JWT).user; //set user request
        } catch (e) {
            req.user= null;
            console.log(e);
        }
    }
    return next();
}