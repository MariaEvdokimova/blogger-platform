import { ObjectId, WithId } from "mongodb";
import { PostInputDto } from "../dto/post.input-dto";
import { Post } from "../types/post"
import { postCollection } from "../../db/mongo.db";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

export const postRepository = {
  async findById( id: string ): Promise<WithId<Post> | null> {
    this._checkObjectId(id);
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  
  async create( newPost: Post ): Promise<string> {
    const insertedPost = await postCollection.insertOne( newPost );
    return insertedPost.insertedId.toString();
  },
  
  async update( id: string, newPost: PostInputDto ) {
    this._checkObjectId(id);
    const updatedResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: { 
          ...newPost,
          blogId: new ObjectId(newPost.blogId),
        }
      }
    );

    if ( updatedResult.matchedCount < 1 ) {
      throw new EntityNotFoundError();
    }   
    
    return;
  },
  
  async delete( id: string ) {
    this._checkObjectId(id);
    
    const deletedResult = await postCollection.deleteOne(
      {
        _id: new ObjectId(id)
      }
    );

    if ( deletedResult.deletedCount < 1) {
      throw new EntityNotFoundError();
    }

    return;
  },
  
  _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  },
}
