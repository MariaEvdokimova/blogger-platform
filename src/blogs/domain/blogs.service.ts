import { ObjectId, WithId } from "mongodb";
import { blogsRepository } from "../repositories/blogs.repository";
import { Blog } from "../types/blog";
import { BlogInputDto } from "../dto/blog.input-dto";
import { postRepository } from "../../posts/repositories/posts.repository";
import { Post } from "../../posts/types/post";
import { PostInBlogInputDto } from "../dto/post-in-blog.input-dto";
import { BlogViewModels } from "../types/blog-view-model";

export const blogsService = {
  async findById(id: string): Promise<WithId<Blog> | null> {
    return await blogsRepository.findById(id);
  },

  async create( blog: BlogInputDto): Promise<string> {
    const { name, description, websiteUrl } = blog;
    const newBlog: Blog = {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
          createdAt: new Date(),
          isMembership: false,
        } 
    
    return await blogsRepository.create(newBlog);
  }, 

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
     
    return await postRepository.create( newPost );
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const { name, description, websiteUrl } = dto;

    const newBlog = {
      name: name,
      description: description,
      websiteUrl: websiteUrl
    }

    await blogsRepository.update(id, newBlog);
    return;
  },

  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
    return;
  },
}
