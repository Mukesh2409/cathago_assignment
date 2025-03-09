const db = require("../db");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        "INSERT INTO users (username, password,name) VALUES (?, ?, ?)",
        [username, hashedPassword, name],
        function (err) {
            if (err) {
                return res.status(400).json({ error: "Username already exists" });
            }
            res.status(201).json({ message: "User registered successfully" });
        }
    );
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        req.session.userId = user.id;
        req.session.role = user.role;

        res.json({ message: "Login successful", role: user.role });
    });
};
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ message: "Logout successful" });
    });
};