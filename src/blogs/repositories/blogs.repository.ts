import { ObjectId, WithId } from "mongodb";
import { BlogInputDto } from "../dto/blog.input-dto";
import { Blog } from "../types/blog";
import { blogCollection } from "../../db/mongo.db";

export const blogsRepository = {
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id)});
  },

  async create( newBlog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return insertResult.insertedId.toString();
  }, 

  async update(id: string, newBlog: BlogInputDto) {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: newBlog
      }
    );
    
    if (updateResult.matchedCount < 1) {
      throw new Error('Blog not exist');
    }

    return;
  },

  async delete(id: string) {
    const deleteResult = await blogCollection.deleteOne(
      {
        _id: new ObjectId(id)
      }
    );
    
    if ( deleteResult.deletedCount < 1 ) {
      throw new Error('Blog not exist');
    }

    return;
  },
}
