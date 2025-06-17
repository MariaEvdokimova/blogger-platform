import { WithId } from "mongodb";
import { PostRepository } from "../repositories/posts.repository";
import { PostInputDto } from "../dto/post.input-dto";
import { Blog } from "../../blogs/types/blog";
import { inject, injectable } from "inversify";
import { PostDocument, PostModel } from "../domain/post.entity";
import { Types } from "mongoose";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) public postRepository: PostRepository
  ){}

  async create( post: PostInputDto, blog: WithId<Blog> ): Promise<PostDocument> {
    const { title, shortDescription, content } = post;
    const { _id: blogId, name: blogName } = blog;

    const newPost = new PostModel();
    newPost.title = title;
    newPost.shortDescription = shortDescription;
    newPost.content = content;
    newPost.blogId = blogId;
    newPost.blogName = blogName;
    newPost.createdAt = new Date();

    return await this.postRepository.save( newPost );
  }
  
  async update( id: string, dto: PostInputDto ): Promise<void> {
    const { title, shortDescription, content, blogId } = dto;

    const post = await this.postRepository.findById(id);
    if ( !post ) {
      throw new EntityNotFoundError();
    }
    
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = new Types.ObjectId(blogId);
    
    await this.postRepository.save(post);
    return;
  }

  async delete( id: string ): Promise<void> {
    const post = await this.postRepository.findById(id);
    if ( !post ) {
      throw new EntityNotFoundError();
    }

    post.deletedAt = new Date();
    await this.postRepository.save(post);
    return;
  }
}
