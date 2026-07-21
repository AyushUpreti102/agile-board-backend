import db from "./db/index.js";

async function testConnection() {
  try {
    // Run a basic test query to get the current timestamp from PostgreSQL
    const res = await db.query("SELECT NOW()");
    console.log("Connection successful! Database time:", res.rows[0].now);
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

testConnection();
