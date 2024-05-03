import type { Context, Env } from "hono";
import type { BlankInput } from "hono/types";
import type { IRepositoryApi } from "../repository/posts";

interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface IServiceApi {
  get(id: number): IPost | undefined;
  getAll(): IPost[];
  delete(id: number): boolean;
  post(data: IPost): boolean;
  //   put: (c: Context<Env, string, BlankInput>) => {};
}

export default class PostsService implements IServiceApi {
  private postsRepository: IRepositoryApi;

  constructor(postsRepository: IRepositoryApi) {
    this.postsRepository = postsRepository;
  }

  get(id: number): IPost | undefined {
    return this.postsRepository.get(id);
  }
  getAll(): IPost[] {
    return this.postsRepository.getAll();
  }
  post(data: IPost): boolean {
    return this.postsRepository.post(data);
  }
  delete(id: number): boolean {
    return this.postsRepository.delete(id);
  }
  private put(c: Context<Env, "/posts", BlankInput>) {}
}
