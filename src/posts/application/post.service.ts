import { WithId } from "mongodb";
import { PostRepository } from "../repositories/posts.repository";
import { PostInputDto } from "../dto/post.input-dto";
import { Blog } from "../../blogs/types/blog";
import { inject, injectable } from "inversify";
import { PostDocument, PostModel } from "../domain/post.entity";
import { Types } from "mongoose";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { PostLikeStatusInputDto } from "../dto/post-like-status.input.dto";
import { PostLikesRepository } from "../repositories/post-likes.repository";
import { PostLikesModel } from "../domain/likes.entity";
import { UsersRepository } from "../../users/repositories/users.repository";

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) public postRepository: PostRepository,
    @inject(PostLikesRepository) public PostLikesRepository: PostLikesRepository,
    @inject(UsersRepository) public UsersRepository: UsersRepository,
  ){}

  async create( post: PostInputDto, blog: WithId<Blog> ): Promise<PostDocument> {
    const { title, shortDescription, content } = post;
    const { _id: blogId, name: blogName } = blog;

    const newPost = PostModel.createPost({ title, shortDescription, content, blogId, blogName });
    
    return await this.postRepository.save( newPost );
  }
  
  async update( id: string, dto: PostInputDto ): Promise<void> {
    const { title, shortDescription, content, blogId } = dto;

    const post = await this.postRepository.findById(id);
    if ( !post ) {
      throw new EntityNotFoundError();
    }
    
    post.updatePostInfo(title, shortDescription, content, new Types.ObjectId(blogId) );
    
    await this.postRepository.save(post);
    return;
  }

  async delete( id: string ): Promise<void> {
    const post = await this.postRepository.findById(id);
    if ( !post ) {
      throw new EntityNotFoundError();
    }

    post.markAsDeleted();
    await this.postRepository.save(post);
    return;
  }

  async updateLikeStatus( postId: string, dto: PostLikeStatusInputDto, userId: string, login: string ): Promise<void> {
      const { likeStatus } = dto;
       const post = await this.postRepository.findById( postId );
      if ( !post ) {
        throw new EntityNotFoundError();
      }
 
      const userPostStatus = await this.PostLikesRepository.findUserPostStatus( postId, userId );
      if ( userPostStatus && userPostStatus.status === likeStatus) return;
  
      post.updateLikesInfo( likeStatus, userPostStatus?.status, userId, login );
      await this.postRepository.save( post );

      if ( userPostStatus) {        
        userPostStatus.updateLikeStatus( likeStatus );
        await this.PostLikesRepository.save( userPostStatus );             
      } else {
        const newStatus = PostLikesModel.createLikeStatus({
          postId: new Types.ObjectId(postId),
          userId: new Types.ObjectId(userId),
          status: likeStatus,
        });    
        await this.PostLikesRepository.save( newStatus );
      }
  
      const lastThreeLikes = await this.PostLikesRepository.findLastThreeLikes(postId);
      const userIds = lastThreeLikes.map(lastLike => lastLike.userId);
      const users = await this.UsersRepository.findByUserIds( userIds ) || [];

      const usersMap = new Map< string, string>(
        users.map(user => [user._id.toString(), user.login || ''])
      );
   
      const newestLikes = lastThreeLikes.map( lastLike => {
        return { 
          addedAt: lastLike.createdAt,
          userId: lastLike.userId.toString(), 
          login: usersMap.get(lastLike.userId.toString()) || '',
        }
      });

      post.updateNewestLikes( newestLikes );  
      await this.postRepository.save( post );

      return;
    }
}
