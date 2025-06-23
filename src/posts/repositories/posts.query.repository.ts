import { ObjectId } from "mongodb";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { PostViewModel } from "../types/post-view-model";
import { injectable } from "inversify";
import { PostDocument, PostLean, PostModel, PostWithMyStatus } from "../domain/post.entity";
import mongoose, { Types } from "mongoose";

@injectable()
export class PostsQueryRepository {
  async getPosts( dto: PaginationQueryParamsDto ): Promise<PostLean[]> {
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
      .lean()
  }

  async getPostsCount( searchNameTerm?: string | ObjectId | null ): Promise<number> {
    const filter: any = {};
    if( searchNameTerm ) {
      filter.blogId = new Types.ObjectId(searchNameTerm);
      filter.deletedAt = null;
    }
    return PostModel.countDocuments( filter );
  }
  
  async findById(id: string ): Promise<PostLean | null> {
    this._checkObjectId(id);
    return PostModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null }).lean();
  }

  async mapPaginationViewMdel (
    dto: {
      posts: PostWithMyStatus[], 
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

  getInView(post: PostWithMyStatus): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: post.extendedLikesInfo.myStatus,
        newestLikes: post.extendedLikesInfo.newestLikes.map( newLikes => {
          return {
            addedAt: newLikes.addedAt,
            login: newLikes.login,
            userId: newLikes.userId,          
          }
      })
      },
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

