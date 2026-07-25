import "dotenv/config";
import db from "./config/db.js";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(cors()); // Allows all origins

app.use(express.json());
app.use("/api", routes);
app.get("/", (req, res) => {
  res.send("this is agile board backend");
});

async function testConnection() {
  try {
    // Run a basic test query to get the current timestamp from PostgreSQL
    const res = await db.query("SELECT NOW()");
    console.log("Connection successful! Database time:", res.rows[0].now);
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

app.listen(3000, () => {
  console.log("listening to port", 3000);
  testConnection();
});
