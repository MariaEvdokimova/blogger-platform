import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongo.db";
import { Blog } from "../types/blog";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { BlogViewModels } from "../types/blog-view-model";
import { injectable } from "inversify";

@injectable()
export class BlogsQueryRepository {
  async getBlogs( dto: PaginationQueryParamsDto ): Promise<WithId<Blog>[]> {
    const filter: any = {};
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    return blogCollection
      .find( filter )
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
      .toArray();
  }

  async getBlogsCount( searchNameTerm: string | null ): Promise<number> {
    const filter: any = {};
    if( searchNameTerm ) {
      filter.name = { $regex: searchNameTerm, $options: 'i'};
    }
    return blogCollection.countDocuments(filter);
  }
  
  async findById(id: string): Promise<WithId<Blog> | null> {
    this._checkObjectId(id);
    return await blogCollection.findOne({ _id: new ObjectId(id)});    
  }

  async findByIdOrFail(id: string): Promise<BlogViewModels | null> {
    this._checkObjectId(id);
    
    const blog = await blogCollection.findOne({ _id: new ObjectId(id)});
    
    if ( !blog ) {
      throw new EntityNotFoundError();
    }
    
    return blog ? this._getInView(blog) : null;
  }

  async mapPaginationViewMdel (
    dto: {
      blogs: WithId<Blog>[], 
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
      items: dto.blogs.map(this._getInView)
    };
  }

  private _getInView(blog: WithId<Blog>): BlogViewModels {
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
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
};
