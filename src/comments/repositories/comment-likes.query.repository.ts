import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { CommentLikesDocument, CommentLikesModel, LikeStatus } from "../domain/likes.entity";

@injectable()
export class CommentsLikesQueryRepository {

  async findStatusByUserIdAndCommentId( userId: string, commentId: string): Promise<LikeStatus | null> {
    this._checkObjectId(userId);
    this._checkObjectId(commentId);
    
    const result = await CommentLikesModel.findOne({ 
      userId: new Types.ObjectId(userId), 
      commentId: new Types.ObjectId(commentId) 
    });
    return result ? result.status : null
  }

  async findByCommentIds(commentIds: Types.ObjectId[], userId: string): Promise<CommentLikesDocument[]>{
    return CommentLikesModel.find({
      commentId: { $in: commentIds },
      userId: new Types.ObjectId(userId)
    }).exec();
  }

  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
};
