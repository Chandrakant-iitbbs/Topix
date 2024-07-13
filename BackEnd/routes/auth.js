const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_secret = "CK@K@nt";

router.use(bodyParser.json());

// ROUTE 1  
// Creating a user using : post "/api/v1/auth/createuser". No login required
router.post('/createuser', async (req, res) => {
    const { name, email, password,interestedTopics } = req.body;
    // res.json({ message: req.body });
    try {
        let usr = await User.findOne({ email });
        if (usr) {
            return res.status(400).json({ error: "Sorry a User with this email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        usr = await User.create({
            name,
            email,
            password: secPass,
            interestedTopics
        });
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
});

module.exports = router