import type { Context, Env } from "hono";
import type { BlankInput } from "hono/types";
import { db } from "../../initDatabase";

interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

class ServiceApi {
  get(c: Context<Env, string, BlankInput>) {}
  getAll(c: Context<Env, string, BlankInput>) {}
  delete(c: Context<Env, string, BlankInput>) {}
  post(c: Context<Env, string, BlankInput>) {}
  put(c: Context<Env, string, BlankInput>) {}
}

export default class PostsService extends ServiceApi {
  get(c: Context<Env, "/posts/:id", BlankInput>) {
    const { id: post_id } = c.req.param();

    const query = db.query(`SELECT * FROM posts WHERE id = ${post_id}`);
    const postById = query.all();

    if (postById.length === 1) {
      c.status(200);

      return c.json(postById);
    } else {
      c.status(400);

      return c.json({ error: "Post not found" });
    }
  }
  getAll(c: Context<Env, "/posts", BlankInput>) {
    const query = db.query("SELECT * FROM posts");
    let posts = query.all();

    c.status(200);

    return c.json(posts);
  }
  async post(c: Context<Env, "/posts", BlankInput>) {
    const expectedKeys = ["id", "userId", "title", "body"];
    const post: IPost = await c.req.json();

    if (
      !expectedKeys.every((key) => Object.keys(post).includes(key)) ||
      !Object.values(post).every((value) => !!value)
    ) {
      c.status(400);

      return c.json({ error: "Invalid post" });
    }

    let query = db.query(
      `INSERT INTO posts (userId, id, title, body) VALUES (${post.userId}, ${post.id}, '${post.title}', '${post.body}')`
    );
    const getPostById = db.query(`SELECT * FROM posts WHERE id = ${post.id}`);
    const postById = getPostById.get();

    if (postById !== null) {
      c.status(400);

      return c.json({ error: "Post exists" });
    }

    query.run();
    c.status(201);

    return c.json(post);
  }
  delete(c: Context<Env, "/posts/:id", BlankInput>) {
    const { id: post_id } = c.req.param();
    const getPostById = db.query(`SELECT * FROM posts WHERE id = ${post_id}`);
    const query = db.query(`DELETE FROM posts WHERE id = ${post_id}`);

    const postByIdBefore = getPostById.get();

    query.run();

    const postByIdAfter = getPostById.get();

    if (postByIdAfter === null && postByIdBefore !== null) {
      c.status(200);

      return c.json(post_id);
    } else {
      c.status(400);

      return c.json({ error: "Post not defined or bad request" });
    }
  }
  put(c: Context<Env, "/posts", BlankInput>) {}
}
