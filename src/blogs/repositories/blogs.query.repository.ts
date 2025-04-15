import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongo.db";
import { Blog } from "../types/blog";
import { mapToBlogViewModel } from "../routers/mappers/map-to-blog-view-model.util";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";

export const blogsQueryRepository = {
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
  },

  async getBlogsCount( searchNameTerm: string | null ): Promise<number> {
    const filter: any = {};
    if( searchNameTerm ) {
      filter.name = { $regex: searchNameTerm, $options: 'i'};
    }
    return blogCollection.countDocuments(filter);
  },
  
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id)});
  },

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
      items: dto.blogs.map(mapToBlogViewModel)
    };
  },
};
