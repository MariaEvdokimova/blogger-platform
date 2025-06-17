import { ObjectId } from "mongodb";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { PostViewModel } from "../types/post-view-model";
import { injectable } from "inversify";
import { PostDocument, PostModel } from "../domain/post.entity";
import mongoose, { Types } from "mongoose";

@injectable()
export class PostsQueryRepository {
  async getPosts( dto: PaginationQueryParamsDto ): Promise<PostDocument[]> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;

    const filter: any = {};
      if (searchNameTerm) {
      filter.blogId = new Types.ObjectId(searchNameTerm);
      filter.deletedAt = null;
    }

    return PostModel
      .find( filter )
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
  }

  async getPostsCount( searchNameTerm?: string | ObjectId | null ): Promise<number> {
    const filter: any = {};
    if( searchNameTerm ) {
      filter.blogId = new Types.ObjectId(searchNameTerm);
      filter.deletedAt = null;
    }
    return PostModel.countDocuments( filter );
  }
  
  async findByIdOrFail(id: string): Promise<PostViewModel> {
    this._checkObjectId(id);
    
    const post = await PostModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null });
    
    if ( !post ) {
      throw new EntityNotFoundError();
    }
    
    return this.getInView(post);
  }

  async mapPaginationViewMdel (
    dto: {
      posts: PostDocument[], 
      pageSize: number, 
      pageNumber: number, 
      postsCount: number,
    }
  ) {
    return {
      pagesCount: Math.ceil( dto.postsCount / dto.pageSize ),
      page: dto.pageNumber,
      pageSize: dto.pageSize,
      totalCount: dto.postsCount,
      items: dto.posts.map(this.getInView)
    };
  }

  getInView(post: PostDocument): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
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

