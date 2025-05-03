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
    const { title, shortDescription, content } = post;
    const { _id: blogId, name: blogName } = blog;

    const newPost: Post = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date(),
    } 

    return await postRepository.create(newPost);
  },
  
  async update( id: string, dto: PostInputDto ): Promise<void> {
    const { title, shortDescription, content, blogId } = dto;

    const newPost = { 
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    }
    
    await postRepository.update(id, newPost);
    return;
  },
  
  async delete( id: string ): Promise<void> {
    await postRepository.delete(id);
    return;
  },
}
