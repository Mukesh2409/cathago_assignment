const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const db = require("./db");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(
    session({
        secret: "supersecret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static("frontend"));
app.use(express.static(path.join(__dirname, "../frontend")));



app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "login.html"));
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});