import { Hono } from "hono";
import { initDatabase } from "./initDatabase";
import Handler from "./pkg/handler/handler";

const app = new Hono();

initDatabase();
const handler = new Handler();

app.route("/", handler.app);

export default {
  port: 6969,
  fetch: app.fetch,
};
