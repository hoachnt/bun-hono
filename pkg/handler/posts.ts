import { Hono } from "hono";
import Service from "../service/service";

export default class PostHandler {
  service: Service = new Service();
  posts = new Hono();

  constructor() {
    this.posts.post("/posts", this.service.posts.post);
    this.posts.get("/posts", this.service.posts.getAll);
    this.posts.get("/posts/:id", this.service.posts.get);
    this.posts.delete("/posts/:id", this.service.posts.delete);
  }
}
