import { WithId } from "mongodb";
import { blogsRepository } from "../repositories/blogs.repository";
import { Blog } from "../types/blog";
import { BlogInputDto } from "../dto/blog.input-dto";
import { postRepository } from "../../posts/repositories/posts.repository";
import { Post } from "../../posts/types/post";
import { PostInBlogInputDto } from "../dto/post-in-blog.input-dto";

export const blogsService = {
  async findById(id: string): Promise<WithId<Blog> | null> {
    return await blogsRepository.findById(id);
  },

  async create( blog: BlogInputDto): Promise<string> {
    const newBlog: Blog = {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: new Date(),
          isMembership: false,
        } 
    
    return await blogsRepository.create(newBlog);
  }, 

  async createPost( post: PostInBlogInputDto, blog: WithId<Blog> ): Promise<string> {
    const newPost: Post = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blog._id,
      blogName: blog.name,
      createdAt: new Date(),
    };
     
    return await postRepository.create( newPost );
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl
    }

    await blogsRepository.update(id, newBlog);
    return;
  },

  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
    return;
  },
}
