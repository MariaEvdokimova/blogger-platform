import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsQueryRepository } from "../../../comments/repositories/comments.query.repository";
import { setDefaultSortAandPagination } from "../../../core/helpers/set-default-sort-and-pagination";

export const getPostCommentHandler = async (
  req: Request<{postId: string}>, 
  res: Response
) => {
  try {
    const id = req.params.postId;    
    const post = await postsQueryRepository.findByIdOrFail( id );

    const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req );    
    
    const comments = await commentsQueryRepository.getCommentsInPost( { pageNumber, pageSize, sortBy, sortDirection} , id );
    const commentsCount = await commentsQueryRepository.getCommentsInPostCount( id );
    const commentListOutput = await commentsQueryRepository.mapPaginationViewMdel(
      { 
        comments,
        pageSize, 
        pageNumber, 
        commentsCount 
      }
    );
  
   res.status(HttpStatus.Success).send( commentListOutput );
  
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
