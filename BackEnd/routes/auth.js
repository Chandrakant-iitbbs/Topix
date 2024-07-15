const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bodyParser = require('body-parser');
const UserMiddleWare = require('../middleWare/UserMiddleWare');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_secret = "CK@K@nt";

router.use(bodyParser.json());

// ROUTE 1  
// Creating a user using : post "/api/v1/auth/createuser". No login required
router.post('/createuser', UserMiddleWare, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Sorry a User with this email already exists." });
        }

        user = await User({ name, email, password });
        user.save();
        const data = {
            user: {
                id: user.id
            }
        }

        const auto_token = jwt.sign(data, JWT_secret);
        res.status(200).json({ auto_token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE 2  
// Authorizing a user using : post "/api/v1/auth/login". No login required
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        let usr = await User.findOne({ email });
        if (!usr) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const passCompare = await bcrypt.compare(password, usr.password);
        if (!passCompare) {
            return res.status(400).json({ error: "Please try to login with correct password" });
        }
        const data = {
            user: {
                id: usr.id
            }
        }
        const auto_token = jwt.sign(data, JWT_secret);
        res.status(200).json({ auto_token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

module.exports = router