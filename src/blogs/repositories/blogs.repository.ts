import { db } from "../../db/in-memory.db";
import { BlogInputDto } from "../dto/blog.input-dto";
import { Blog } from "../types/blog";

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: string): Blog | null {
    return db.blogs.find( blog => blog.id === id) ?? null;
},

  create( newBlog: Blog): Blog{
    db.blogs.push(newBlog);

    return newBlog;
  }, 

  update(id: string, dto: BlogInputDto) {
    const blog = db.blogs.find( blog => blog.id === id);

    if (!blog) {
      throw new Error('Blog not exist');
    }

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return;
  },

  delete(id: string) {
    const index = db.blogs.findIndex( blog => blog.id === id);

    if ( index === -1 ) {
      throw new Error('Blog not exist');
    }
    
    db.blogs.splice( index, 1);
    return;
  },
}
