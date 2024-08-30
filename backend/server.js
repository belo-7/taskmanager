const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { promisify } = require("util"); // To use promisify for converting callback-based functions to promises

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Task",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit process with failure code
  }
  console.log("Connected to the database.");
});

// Promisify the db.query method
const query = promisify(db.query).bind(db);

// Signup route
app.post("/Signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkEmailSql = "SELECT * FROM Login WHERE email = ?";
    const result = await query(checkEmailSql, [email]);

    if (result.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql =
      "INSERT INTO Login (username, email, password) VALUES (?, ?, ?)";
    await query(insertSql, [username, email, hashedPassword]);

    return res.json({ message: "Registered successfully!" });
  } catch (err) {
    console.error("Failed to register:", err);
    return res.status(500).json({ error: "Failed to register" });
  }
});

// Login route
app.post("/Form", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM Login WHERE email = ?";
    const data = await query(sql, [email.toLowerCase()]);

    if (data.length > 0) {
      const user = data[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return res.json("success");
      } else {
        return res.status(401).json("failed"); // Respond with failed login
      }
    } else {
      return res.status(404).json("failed"); // No user found
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login error" });
  }
});

app.get("/Task", async (req, res) => {
  try {
    const results = await query("SELECT * FROM taskManager");
    res.json(results);
  } catch (err) {
    console.error("Error fetching taskManager:", err);
    res.status(500).json({ error: "Error fetching taskManager" });
  }
});

// Add a new task
app.post("/Task", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await query("INSERT INTO taskManager (name) VALUES (?)", [
      name,
    ]);
    res.json({ id: result.insertId, name, completed: false });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Error adding task" });
  }
});

// Update a task
app.put("/Task/:id", async (req, res) => {
  const { id } = req.params;
  const { name, completed } = req.body;

  try {
    await query("UPDATE taskManager SET name = ?, completed = ? WHERE id = ?", [
      name,
      completed,
      id,
    ]);
    res.json({ id, name, completed });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Error updating task" });
  }
});

// Delete a task
app.delete("/Task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await query("DELETE FROM taskManager WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Error deleting task" });
  }
});

// Delete completed tasks
app.delete("/Task/completed", async (req, res) => {
  try {
    await query("DELETE FROM taskManager WHERE completed = true");
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting completed tasks:", err);
    res.status(500).json({ error: "Error deleting completed tasks" });
  }
});

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});