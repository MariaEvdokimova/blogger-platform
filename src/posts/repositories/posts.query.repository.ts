import { ObjectId, WithId } from "mongodb";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { Post } from "../types/post";
import { postCollection } from "../../db/mongo.db";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { PostViewModel } from "../types/post-view-model";

export const postsQueryRepository = {
  async getPosts( dto: PaginationQueryParamsDto ): Promise<WithId<Post>[]> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;

    const filter: any = {};
      if (searchNameTerm) {
      filter.blogId = new ObjectId(searchNameTerm);
    }

    return postCollection
      .find( filter )
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
      .toArray();
  },

  async getPostsCount( searchNameTerm?: string | ObjectId | null ): Promise<number> {
    const filter: any = {};
    if( searchNameTerm ) {
      filter.blogId = new ObjectId(searchNameTerm);
    }
    return postCollection.countDocuments( filter );
  },
  
  async findById(id: string): Promise<WithId<Post> | null> {
    this._checkObjectId(id);
    return postCollection.findOne({ _id: new ObjectId(id)});
  },

  async findByIdOrFail(id: string): Promise<PostViewModel> {
    this._checkObjectId(id);
    
    const post = await  postCollection.findOne({ _id: new ObjectId(id)});
    
    if ( !post ) {
      throw new EntityNotFoundError();
    }
    
    return this._getInView(post);
  },

  async mapPaginationViewMdel (
    dto: {
      posts: WithId<Post>[], 
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
      items: dto.posts.map(this._getInView)
    };
  },

  _getInView(post: WithId<Post>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },

  _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  },
};

