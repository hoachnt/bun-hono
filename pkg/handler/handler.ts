import { Hono } from "hono";
import PostHandler from "./posts";

export default class Handler {
  app = new Hono();

  constructor() {
    const postHandler = new PostHandler();
    
    this.app.route("/", postHandler.posts);
  }
}
