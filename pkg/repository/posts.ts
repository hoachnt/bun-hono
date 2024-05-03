import type { Context, Env } from "hono";
import type { BlankInput } from "hono/types";
import { db } from "../../initDatabase";

interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface IRepositoryApi {
  get(id: number): IPost | undefined;
  getAll(): IPost[];
  delete(id: number): boolean;
  post(data: IPost): boolean;
  put(c: Context<Env, string, BlankInput>): void;
}

export default class PostRepository implements IRepositoryApi {
  get(id: number): IPost | undefined {
    const query = db.query(`SELECT * FROM posts WHERE id = ${id}`);
    const postById = query.all() as IPost[];

    if (postById.length === 1) {
      return postById[0];
    } else {
      return undefined; // or handle the error condition appropriately
    }
  }
  getAll() {
    const query = db.query("SELECT * FROM posts");
    let posts = query.all() as IPost[];

    return posts;
  }
  post(data: IPost): boolean {
    let isPostExist: boolean = false;
    let query = db.query(
      `INSERT INTO posts (userId, id, title, body) VALUES (${data.userId}, ${data.id}, '${data.title}', '${data.body}')`
    );
    const getPostById = db.query(`SELECT * FROM posts WHERE id = ${data.id}`);
    const postById = getPostById.get();

    if (postById !== null) {
      isPostExist = true;

      return isPostExist;
    }

    isPostExist = false;

    query.run();

    return isPostExist;
  }
  delete(id: number) {
    let isError = false;
    const getPostById = db.query(`SELECT * FROM posts WHERE id = ${id}`);
    const query = db.query(`DELETE FROM posts WHERE id = ${id}`);

    const postByIdBefore = getPostById.get();

    query.run();

    const postByIdAfter = getPostById.get();

    if (postByIdAfter === null && postByIdBefore !== null) {
      isError = false;
    } else {
      isError = true;
    }

    return isError;
  }
  put(c: Context<Env, "/posts", BlankInput>) {}
}
