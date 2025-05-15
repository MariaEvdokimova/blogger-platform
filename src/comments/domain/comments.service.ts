import { ObjectId, WithId } from "mongodb";
import { CommentInputDto } from "../dto/comment.input-dto";
import { commentsRepository } from "../repositories/comments.repository";
import { Comment } from "../types/comment";
import { PostViewModel } from "../../posts/types/post-view-model";
import { User } from "../../users/entities/user.entity";

export const commentsService = {
  async create( comment: CommentInputDto, post: PostViewModel, user: WithId<User> ): Promise<string> {
    const { content } = comment;
    const { id: postId } = post;
    const { _id: userId, login } = user;
    
    const newComment: Comment = {
      content: content,
      commentatorInfo: {
        userId: userId,  
        userLogin: login,
      },
      createdAt: new Date(),
      postId: new ObjectId(postId),
    } 

    return await commentsRepository.create( newComment );
  },
  
  async update( id: string, dto: CommentInputDto ): Promise<void> {
    const newComment = {
      content: dto.content
    }

    await commentsRepository.update(id, newComment);
    return;
  },

  async delete(id: string ): Promise<void> {
    await commentsRepository.delete(id);
    return;
  },

  async verifyUserOwnership(id: string, userId: string): Promise<void> {
    await commentsRepository.verifyUserOwnership( id, userId);
    return;
  },
}
