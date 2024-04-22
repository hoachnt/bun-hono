import { Hono } from "hono";
import PostHandler from "./posts";

export default class Handler {
  app = new Hono();

  constructor() {
    this.app.route("/", new PostHandler().posts);
  }
}
