import { BlogDocument, BlogModel } from "../domain/blog.entity";
import { CreateBlogDto } from "../dto/blog.create-dto";

export class BlogEntity {
  createdAt: Date = new Date();
  deletedAt: Date | null = null;
 
  constructor(
    public name:	string,
    public description: string,
    public websiteUrl:	string,
    public isMembership: boolean,
  ){}
 
  static createBlog(dto: CreateBlogDto){
    return new BlogModel({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
    }) as BlogDocument
  }

  markAsDeleted(): void {
    this.deletedAt = new Date();
  }

  updateBlogInfo( name: string, description: string, websiteUrl: string): void {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }

}