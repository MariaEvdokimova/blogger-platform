import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { CommentDocument, CommentModel } from "../domain/comment.entity";

@injectable()
export class CommentsRepository {

  async save( comment: CommentDocument ): Promise<string> {
    const insertResult = await comment.save();
    return insertResult._id.toString();
  }

  async findById(id: string): Promise<CommentDocument | null> {
    this._checkObjectId(id);
    return CommentModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null });
  }

  async verifyUserOwnership ( commentId: string, userId: string): Promise<CommentDocument | null>  {
    this._checkObjectId( userId );
    this._checkObjectId( commentId );

    return CommentModel.findOne({
      _id: new Types.ObjectId(commentId),
      'commentatorInfo.userId': new Types.ObjectId(userId)
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
