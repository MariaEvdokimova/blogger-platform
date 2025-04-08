import { ObjectId, WithId } from "mongodb";
import { PostInputDto } from "../dto/post.input-dto";
import { Post } from "../types/post"
import { postCollection } from "../../db/mongo.db";

export const postRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findById( id: string ): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  
  async create( newPost: Post ): Promise<WithId<Post>> {
    const insertedPost = await postCollection.insertOne( newPost );
    return {...newPost, _id: insertedPost.insertedId};
  },
  
  async update( id: string, dto: PostInputDto ) {
    const updatedResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: { 
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: new ObjectId(dto.blogId),
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
