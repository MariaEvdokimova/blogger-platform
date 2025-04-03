import { db } from "../../db/in-memory.db"
import { PostInputDto } from "../dto/post.input-dto";
import { Post } from "../types/post"

export const postRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById( id: string ): Post | null {
    return db.posts.find( post => post.id === id) ?? null;
  },
  
  create( newPost: Post ): Post {
    db.posts.push( newPost );
    return newPost;
  },
  
  update( id: string, dto: PostInputDto ) {
    const post = db.posts.find( post => post.id === id);

    if ( !post ) {
      throw new Error('Post not exist');
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    
    return;
  },
  
  delete( id: string ) {
    const index = db.posts.findIndex( post => post.id === id );

    if (index === -1) {
      throw new Error('Post not exist');
    }

    db.posts.splice( index, 1 );    
    return;
  },
}
