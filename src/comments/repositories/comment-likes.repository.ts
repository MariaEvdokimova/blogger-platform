import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { CommentLikesDocument, CommentLikesModel } from "../domain/likes.entity";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

@injectable()
export class CommentLikesRepository {

  async save( likeStatus: CommentLikesDocument ): Promise<CommentLikesDocument> {
    return likeStatus.save();    
  }

  async findUserCommentStatus( commentId: string, userId: string ): Promise<CommentLikesDocument | null> {
    this._checkObjectId( userId );
    this._checkObjectId( commentId );

    return CommentLikesModel.findOne({
      commentId: new Types.ObjectId(commentId),
      userId: new Types.ObjectId(userId)
    });
  }

  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
