import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { setDefaultSortAandPagination } from "../../../core/helpers/set-default-sort-and-pagination";

export const getBlogListHandler = async (req: Request, res: Response) => {
  try {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = setDefaultSortAandPagination( req );    

    const blogs = await blogsQueryRepository.getBlogs( { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} );
    const blogsCount = await blogsQueryRepository.getBlogsCount( searchNameTerm );
    const blogListOutput = await blogsQueryRepository.mapPaginationViewMdel(
      { 
        blogs,
        pageSize, 
        pageNumber, 
        blogsCount 
      }
    );

    res.status(HttpStatus.Ok).send(blogListOutput);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
