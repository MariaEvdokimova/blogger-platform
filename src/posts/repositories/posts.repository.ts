import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import { PostDocument, PostModel } from "../domain/post.entity";
import mongoose, { Types } from "mongoose";

@injectable()
export class PostRepository {
  async save( post: PostDocument ): Promise<PostDocument> {
    return await post.save();
  }
  
  async findById( id: string ): Promise<PostDocument | null> {
    this._checkObjectId(id);
    return PostModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null });
  }
  
  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
