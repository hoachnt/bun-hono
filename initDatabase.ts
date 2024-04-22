import { Database } from "bun:sqlite";

const db = new Database("./db.sqlite", { create: true });

function initDatabase() {
  const tableExists = db
    .query(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='posts';`
    )
    .get();

  if (!tableExists) {
    db.query("CREATE TABLE posts (userId, id, title, body);").run();

    console.log("Table 'posts' created successfully.");
  } else {
    console.log("Table 'posts' already exists.");
  }
}

// let query = db.query(
//   "INSERT INTO posts (userId, id, title, body) VALUES ('${post.userId}', '${post.id}', '${post.title}', '${post.body}')"
// );

// query.run();

export { db, initDatabase };
