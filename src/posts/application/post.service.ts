import { WithId } from "mongodb";
import { Post } from "../types/post";
import { postRepository } from "../repositories/posts.repository";
import { PostInputDto } from "../dto/post.input-dto";
import { Blog } from "../../blogs/types/blog";

export const postService = {
  async findById( id: string ): Promise<WithId<Post> | null> {
    return await postRepository.findById(id);
  },
  
  async create( post: PostInputDto, blog: WithId<Blog> ): Promise<string> {
    const newPost: Post = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blog._id,
      blogName: blog.name,
      createdAt: new Date(),
    } 

    return await postRepository.create(newPost);
  },
  
  async update( id: string, dto: PostInputDto ): Promise<void> {
    const newPost = { 
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    }
    
    await postRepository.update(id, newPost);
    return;
  },
  
  async delete( id: string ): Promise<void> {
    await postRepository.delete(id);
    return;
  },
}
