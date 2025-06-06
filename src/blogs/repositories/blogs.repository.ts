import { ObjectId, WithId } from "mongodb";
import { BlogInputDto } from "../dto/blog.input-dto";
import { Blog } from "../types/blog";
import { blogCollection } from "../../db/mongo.db";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  async findById(id: string): Promise<WithId<Blog> | null> {
    this._checkObjectId(id);
    return blogCollection.findOne({ _id: new ObjectId(id)});
  }

  async create( newBlog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return insertResult.insertedId.toString();
  }

  async update(id: string, newBlog: BlogInputDto) {
    this._checkObjectId(id);

    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: newBlog
      }
    );
    
    if (updateResult.matchedCount < 1) {
      throw new EntityNotFoundError();
    }

    return;
  }

  async delete(id: string) {
    this._checkObjectId(id);
    
    const deleteResult = await blogCollection.deleteOne(
      {
        _id: new ObjectId(id)
      }
    );
    
    if ( deleteResult.deletedCount < 1 ) {
      throw new EntityNotFoundError();
    }

    return;
  }
  
  private _checkObjectId(id: string): boolean | EntityNotFoundError {
      const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
