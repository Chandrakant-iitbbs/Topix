const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bodyParser = require('body-parser');
const UserMiddleWare = require('../middleWare/UserMiddleWare');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Fetchuser = require('../middleWare/FetchUser');
const JWT_secret = "CK@K@nt";

router.use(bodyParser.json());

// ROUTE 1  
// Creating a user using : post "/api/v1/auth/createuser". No login required
router.post('/createuser', UserMiddleWare, async (req, res) => {
    const { name, email, password, dp } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Sorry a User with this email already exists." });
        }
        if (dp) {
            user = await User({ name, email, password, dp });
        }
        else {
            user = await User({ name, email, password });
        }
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

// ROUTE 3
// Get logged in user details using : get "/api/v1/auth/getuser". Login required
router.get('/getuser', Fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
)

// ROUTE 4
// Update user details using : put "/api/v1/auth/updateuser". Login required
router.put('/updateuser', Fetchuser, async (req, res) => {
    const { name, email, password, interestedTopics, dp } = req.body;
    try {
        let newUser = {};
        if (name) {
            newUser.name = name;
        }
        if (email) {
            newUser.email = email;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            newUser.password = hash;
        }
        if (interestedTopics) {
            newUser.interestedTopics = interestedTopics;
        }
        if (dp) {
            newUser.dp = dp;
        }

        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send("Not Found");
        }
        user = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true });
        res.json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 5
// Delete user using : delete "/api/v1/auth/deleteuser". Login required
router.delete('/deleteuser', Fetchuser, async (req, res) => {
    try {
        let user = await User.findById(req.user.id
        );
        if (!user) {
            return res.status(404).send("Not Found");
        }
        user = await User.findByIdAndDelete(req.user.id);
        res.json({ "Success": "User has been deleted", user: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

// ROUTE 6
// Get all users using : get "/api/v1/auth/getallusers". Login required
router.get('/getallusers', Fetchuser, async (req, res) => {
    try {
        const user = await User.find().select("-password");
        res.status(200).send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
);

module.exports = router