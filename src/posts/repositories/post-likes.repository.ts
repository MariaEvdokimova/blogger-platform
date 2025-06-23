import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { LikeStatus, PostLikesDocument, PostLikesModel } from "../domain/likes.entity";

@injectable()
export class PostLikesRepository {

  async save( likeStatus: PostLikesDocument ): Promise<PostLikesDocument> {
    return likeStatus.save();    
  }

  async findUserPostStatus( postId: string, userId: string ): Promise<PostLikesDocument | null> {
    this._checkObjectId( userId );
    this._checkObjectId( postId );

    return PostLikesModel.findOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId)
    });
  }

  async findLastThreeLikes ( postId: string): Promise<PostLikesDocument[]> {
    return PostLikesModel.find({
     postId: new Types.ObjectId(postId),
      status: LikeStatus.Like
    })
    .sort({ createdAt: -1 })
    .limit(3)
  }

  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
