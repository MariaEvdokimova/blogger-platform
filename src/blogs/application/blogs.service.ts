import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogInputDto } from "../dto/blog.input-dto";
import { inject, injectable } from "inversify";
import { BlogDocument, BlogModel } from "../domain/blog.entity";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) public blogsRepository: BlogsRepository,
  ){}

  async create( blog: BlogInputDto): Promise<BlogDocument> {
    const { name, description, websiteUrl } = blog;

    const newBlog = new BlogModel();
    newBlog.name = name;
    newBlog.description = description;
    newBlog.websiteUrl = websiteUrl;
    newBlog.isMembership = false;
    newBlog.createdAt = new Date();

    return await this.blogsRepository.save( newBlog );
  }

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const { name, description, websiteUrl } = dto;

    const blog = await this.blogsRepository.findById(id);
    if ( !blog ) {
      throw new EntityNotFoundError();
    }

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;

    await this.blogsRepository.save(blog);
    return;
  }

  async delete(id: string): Promise<void> {
    const blog = await this.blogsRepository.findById(id);
    if ( !blog ) {
      throw new EntityNotFoundError();
    }

    blog.deletedAt = new Date();
    await this.blogsRepository.save(blog);
    return;
  }
}
