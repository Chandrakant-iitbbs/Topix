const jwt = require('jsonwebtoken');
const JWT_secret = "CK@K@nt";

const Fetchuser =(req, res, next)=>{
    const token = req.header("auth-header");     
    if (!token) {
        res.status(401).send({error: "Enter the token"});  
    }
    try {
        const data = jwt.verify(token, JWT_secret);   // verify from token
        req.user = data.user;    
        next();    
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
}

module.exports = Fetchuser;