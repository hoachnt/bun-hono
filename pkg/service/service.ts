import Repository from "../repository/repository";
import PostsService from "./posts";

export default class Service {
  private repository = new Repository();
  posts: PostsService;

  constructor() {
    this.posts = new PostsService(this.repository.posts);
  }
}
