import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { BlogViewModels } from "../types/blog-view-model";
import { injectable } from "inversify";
import { BlogDocument, BlogModel } from "../domain/blog.entity";
import mongoose, { Types } from "mongoose";

@injectable()
export class BlogsQueryRepository {
  async getBlogs( dto: PaginationQueryParamsDto ): Promise<BlogDocument[]> {
    const filter: any = {};
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
      filter.deletedAt = null;
    }

    return BlogModel
      .find( filter )
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
  }

  async getBlogsCount( searchNameTerm: string | null ): Promise<number> {
    const filter: any = {};
    if( searchNameTerm ) {
      filter.name = { $regex: searchNameTerm, $options: 'i'};
      filter.deletedAt = null;
    }
    return BlogModel.countDocuments(filter);
  }
  
  async findById(id: string): Promise<BlogDocument | null> {
    this._checkObjectId(id);
    return await BlogModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null});    
  }

  async findByIdOrFail(id: string): Promise<BlogViewModels | null> {
    this._checkObjectId(id);
    
    const blog = await BlogModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null});
    
    if ( !blog ) {
      throw new EntityNotFoundError();
    }
    
    return blog ? this.getInView(blog) : null;
  }

  async mapPaginationViewMdel (
    dto: {
      blogs: BlogDocument[], 
      pageSize: number, 
      pageNumber: number, 
      blogsCount: number,
    }
  ) {
    return {
      pagesCount: Math.ceil(dto.blogsCount / dto.pageSize),
      page: dto.pageNumber,
      pageSize: dto.pageSize,
      totalCount: dto.blogsCount,
      items: dto.blogs.map(this.getInView)
    };
  }

  getInView(blog: BlogDocument): BlogViewModels {
      return {
        id: blog._id.toString(),
        name:	blog.name,
        description: blog.description,
        websiteUrl:	blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
  }
  
  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
};
