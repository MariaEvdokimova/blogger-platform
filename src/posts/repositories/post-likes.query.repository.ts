import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { LikeStatus } from "../domain/likes.entity";
import { PostLikesDocument, PostLikesModel } from "../../posts/domain/likes.entity";

@injectable()
export class PostsLikesQueryRepository {

  async findStatusByUserIdAndPostId( userId: string, postId: string): Promise<LikeStatus | null> {
    this._checkObjectId(userId);
    this._checkObjectId(postId);
    
    const result = await PostLikesModel.findOne({ 
      userId: new Types.ObjectId(userId), 
      postId: new Types.ObjectId(postId) 
    });
    return result ? result.status : null
  }

  async findByPostIds(postIds: Types.ObjectId[], userId: string): Promise<PostLikesDocument[]>{
    return PostLikesModel.find({
      postId: { $in: postIds },
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
