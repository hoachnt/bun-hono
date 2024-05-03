import { Hono, type Context, type Env } from "hono";
import Service from "../service/service";
import type { BlankInput } from "hono/types";

interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default class PostHandler {
  service: Service;
  posts = new Hono();

  constructor() {
    this.service = new Service();

    this.posts.post("/posts", (c) => this.post(c));
    this.posts.get("/posts", (c) => this.getAll(c));
    this.posts.get("/posts/:id", (c) => this.get(c));
    this.posts.delete("/posts/:id", (c) => this.delete(c));
  }

  get(c: Context<Env, "/post/:id", BlankInput>) {
    const { id } = c.req.param();

    const post = this.service.posts.get(Number(id)); // ошибка: undefined

    if (post) {
      c.status(200);

      return c.json(post);
    } else {
      c.status(400);

      return c.json({ error: "Post not found" });
    }
  }
  getAll(c: Context<Env, string, BlankInput>) {
    const posts = this.service.posts.getAll();

    c.status(200);

    return c.json(posts);
  }
  async post(c: Context<Env, string, BlankInput>) {
    const expectedKeys = ["id", "userId", "title", "body"];
    const post: IPost = await c.req.json();

    if (
      !expectedKeys.every((key) => Object.keys(post).includes(key)) ||
      !Object.values(post).every((value) => !!value)
    ) {
      c.status(400);

      return c.json({ error: "Invalid post" });
    }

    const isPostExist = this.service.posts.post(post);

    if (isPostExist) {
      c.status(400);

      return c.json({ error: "Post exists" });
    }

    c.status(201);

    return c.json(post);
  }
  delete(c: Context<Env, "/posts/:id", BlankInput>) {
    const { id } = c.req.param();
    const isError = this.service.posts.delete(Number(id));

    if (!isError) {
      c.status(200);

      return c.json(id);
    } else {
      c.status(400);

      return c.json({ error: "Post not defined or bad request" });
    }
  }
}
