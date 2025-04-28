import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { postsQueryRepository } from "../../../posts/repositories/posts.query.repository";
import { setDefaultSortAandPagination } from "../../../core/helpers/set-default-sort-and-pagination";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const getBlogPostsHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.blogId;
    const blog = await blogsQueryRepository.findByIdOrFail(id);

    const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req ); 

    const searchNameTerm = blog._id;

    const posts = await postsQueryRepository.getPosts({ pageNumber, pageSize, sortBy, sortDirection, searchNameTerm });
    const postsCount = await postsQueryRepository.getPostsCount( searchNameTerm ); 
    const postListOutput = await postsQueryRepository.mapPaginationViewMdel({ posts, pageSize, pageNumber, postsCount });

    res.status(HttpStatus.Ok).send(postListOutput);
    
  } catch (e: unknown ) {
    errorsHandler(e, res);
  }
};
