const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "hackathonsecret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

app.use(express.json()); // Important to read JSON body


let users = []; // Temporary in-memory storage

// Home route
app.get("/", (req, res) => {
  res.send("EduScale Backend is Running 🚀");
});

// Register route
app.post("/register", (req, res) => {
  const { name, email } = req.body;

  users.push({ name, email });

  res.json({
    message: "User registered successfully",
    users: users
  });
});



// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Login route
app.post("/login", (req, res) => {
  const { email } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign(
    { email: user.email },
    "hackathonsecret",
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token: token
  });
});

// Protected route
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user
  });
});

// System status route
app.get("/system-status", (req, res) => {
  res.json({
    status: "Server Running",
    totalUsers: users.length,
    uptimeInSeconds: process.uptime(),
    timestamp: new Date()
  });
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});