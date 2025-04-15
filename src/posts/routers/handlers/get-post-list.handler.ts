import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { setDefaultSortAandPagination } from "../../../core/helpers/set-default-sort-and-pagination";

export const getPostListHandler = async (req: Request, res: Response) => {
  try {
    const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req ); 
    
    const posts = await postsQueryRepository.getPosts({ pageNumber, pageSize, sortBy, sortDirection });
    const postsCount = await postsQueryRepository.getPostsCount(); 
    const postListOutput = await postsQueryRepository.mapPaginationViewMdel({ posts, pageSize, pageNumber, postsCount });

    res.status(HttpStatus.Ok).send(postListOutput);

  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
