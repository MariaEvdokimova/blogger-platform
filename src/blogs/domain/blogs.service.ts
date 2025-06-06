import { ObjectId, WithId } from "mongodb";
import { BlogsRepository } from "../repositories/blogs.repository";
import { Blog } from "../types/blog";
import { BlogInputDto } from "../dto/blog.input-dto";
import { PostRepository } from "../../posts/repositories/posts.repository";
import { Post } from "../../posts/types/post";
import { PostInBlogInputDto } from "../dto/post-in-blog.input-dto";
import { BlogViewModels } from "../types/blog-view-model";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) public blogsRepository: BlogsRepository,
    @inject(PostRepository) public postRepository: PostRepository,
  ){}

  async findById(id: string): Promise<WithId<Blog> | null> {
    return await this.blogsRepository.findById(id);
  }

  async create( blog: BlogInputDto): Promise<string> {
    const { name, description, websiteUrl } = blog;
    const newBlog: Blog = {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: new Date(),
          isMembership: false,
        } 
    
    return await this.blogsRepository.create(newBlog);
  }

  async createPost( post: PostInBlogInputDto, blog: BlogViewModels ): Promise<string> {
    const { title, shortDescription, content } = post;
    const { id: blogId, name: blogName } = blog;

    const newPost: Post = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: new ObjectId(blogId),
      blogName: blogName,
      createdAt: new Date(),
    };
     
    return await this.postRepository.create( newPost );
  }

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const { name, description, websiteUrl } = dto;

    const newBlog = {
      name: name,
      description: description,
      websiteUrl: websiteUrl
    }

    await this.blogsRepository.update(id, newBlog);
    return;
  }

  async delete(id: string): Promise<void> {
    await this.blogsRepository.delete(id);
    return;
  }
}
