const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST",
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Task",
});

app.post("/Signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if email already exists
  const checkEmailSql = "SELECT * FROM Login WHERE email = ?";
  db.query(checkEmailSql, [email], async (err, result) => {
    if (err) {
      console.error("Failed to query database:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql =
        "INSERT INTO Login (username, email, password) VALUES (?, ?, ?)";
      const values = [username, email, hashedPassword];

      db.query(insertSql, values, (err, data) => {
        if (err) {
          console.error("Failed to insert data:", err);
          return res.status(500).json({ error: "Failed to register" });
        }
        return res.json({ message: "Registered successfully!" });
      });
    }
  });
});

app.post("/Form", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM Login WHERE email = ?";
  db.query(sql, [email.toLowerCase()], async (err, data) => {
    if (err) {
      console.log("Database query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (data.length > 0) {
      const user = data[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return res.json("success");
      } else {
        return res.json("failed");
      }
    } else {
      return res.json("failed");
    }
  });
});

app.listen(8082, () => {
  console.log("listening....");
});
