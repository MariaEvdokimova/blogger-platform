import { ObjectId, WithId } from "mongodb";
import { PostInputDto } from "../dto/post.input-dto";
import { Post } from "../types/post"
import { postCollection } from "../../db/mongo.db";

export const postRepository = {
  async findById( id: string ): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  
  async create( newPost: Post ): Promise<string> {
    const insertedPost = await postCollection.insertOne( newPost );
    return insertedPost.insertedId.toString();
  },
  
  async update( id: string, newPost: PostInputDto ) {
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
      throw new Error('Post not exist');
    }   
    
    return;
  },
  
  async delete( id: string ) {
    const deletedResult = await postCollection.deleteOne(
      {
        _id: new ObjectId(id)
      }
    );

    if ( deletedResult.deletedCount < 1) {
      throw new Error('Post not exist');
    }

    return;
  },
}
