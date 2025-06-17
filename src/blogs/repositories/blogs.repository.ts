import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import { BlogDocument, BlogModel } from "../domain/blog.entity";
import mongoose, { Types } from "mongoose";

@injectable()
export class BlogsRepository {
  async save( blog: BlogDocument ): Promise<BlogDocument> {
    return await blog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    this._checkObjectId(id);
    return BlogModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null });
  }

  private _checkObjectId(id: string): boolean | EntityNotFoundError {
      const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
