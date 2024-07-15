const UserMiddleWare = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || name.length < 3) {
            return res.status(400).json({ error: "Name must be atleast 3 characters long" });
        }
        if (!password || password.length < 5) {
            return res.status(400).json({ error: "Password must be atleast 5 characters long" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        next();
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
}

module.exports = UserMiddleWare;