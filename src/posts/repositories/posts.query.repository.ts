import { ObjectId, WithId } from "mongodb";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { Post } from "../types/post";
import { postCollection } from "../../db/mongo.db";
import { mapToPostViewModel } from "../mappers/map-to-post-view-model.util";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

export const postsQueryRepository = {
  async getPosts( dto: PaginationQueryParamsDto ): Promise<WithId<Post>[]> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = dto;

    const filter: any = {};
      if (searchNameTerm) {
      filter.blogId = searchNameTerm;
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
      filter.blogId = searchNameTerm;
    }
    return postCollection.countDocuments( filter );
  },
  
  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id)});
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const post = await  postCollection.findOne({ _id: new ObjectId(id)});
    
    if ( !post ) {
      throw new EntityNotFoundError();
    }
    
    return post;
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
      items: dto.posts.map(mapToPostViewModel)
    };
  },
};

