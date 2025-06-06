import { Request, Response } from "express";
import { BlogInputDto } from "../dto/blog.input-dto";
import { BlogsService } from "../domain/blogs.service";
import { BlogsQueryRepository } from "../repositories/blogs.query.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { PostInBlogInputDto } from "../dto/post-in-blog.input-dto";
import { PostsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { setDefaultSortAandPagination } from "../../core/helpers/set-default-sort-and-pagination";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) public blogsService: BlogsService,
    @inject(BlogsQueryRepository) public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository) public postsQueryRepository: PostsQueryRepository,
  ){}

  async createBlog (
    req: Request<{}, {}, BlogInputDto>, 
    res: Response
  ){
    try {    
      const createdBlogId = await this.blogsService.create(req.body);
      const createdBlog = await this.blogsQueryRepository.findByIdOrFail(createdBlogId);
      
      res.status(HttpStatus.Created).send( createdBlog );
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPostInBlog (
    req: Request<{ blogId: string }, {}, PostInBlogInputDto>, 
    res: Response
  ){
    try {
      const id = req.params.blogId;

      const blog = await this.blogsQueryRepository.findByIdOrFail(id);
      const createdPostId = await this.blogsService.createPost(req.body, blog!);
      const createdPost = await this.postsQueryRepository.findByIdOrFail(createdPostId);
    
      res.status(HttpStatus.Created).send(createdPost);
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteBlog (
    req: Request<{id: string},{},{}>, 
    res: Response
  ){
    try {
      const id = req.params.id;
      
      await this.blogsQueryRepository.findByIdOrFail(id);
      await this.blogsService.delete(id);
      
      res.status(HttpStatus.NoContent).send();

    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlogList (req: Request, res: Response) {
    try {
      const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req );    
      const searchNameTerm = req.query.searchNameTerm?.toString() || null;

      const blogs = await this.blogsQueryRepository.getBlogs( { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} );
      const blogsCount = await this.blogsQueryRepository.getBlogsCount( searchNameTerm );
      const blogListOutput = await this.blogsQueryRepository.mapPaginationViewMdel(
        { 
          blogs,
          pageSize, 
          pageNumber, 
          blogsCount 
        }
      );

      res.status(HttpStatus.Success).send(blogListOutput);

    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getBlogPosts (req: Request, res: Response) {
    try {
      const id = req.params.blogId;
      const blog = await this.blogsQueryRepository.findByIdOrFail(id);

      const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req ); 

      const searchNameTerm = blog!.id;

      const posts = await this.postsQueryRepository.getPosts({ pageNumber, pageSize, sortBy, sortDirection, searchNameTerm });
      const postsCount = await this.postsQueryRepository.getPostsCount( searchNameTerm ); 
      const postListOutput = await this.postsQueryRepository.mapPaginationViewMdel({ posts, pageSize, pageNumber, postsCount });

      res.status(HttpStatus.Success).send(postListOutput);
      
    } catch (e: unknown ) {
      errorsHandler(e, res);
    }
  }

  async getBlog(
    req: Request<{id: string},{},{}>, 
    res: Response
  ){
    try {
      const id = req.params.id;

      const blog = await this.blogsQueryRepository.findByIdOrFail(id);
      res.status(HttpStatus.Success).send(blog);

    } catch ( e: unknown ) {
      errorsHandler(e, res);
    }
  }

  async updateBlog (
    req: Request<{id: string}, {}, BlogInputDto>, 
    res: Response
  ){
    try {
      const id = req.params.id;
      
      await this.blogsQueryRepository.findByIdOrFail(id);    
      await this.blogsService.update(id, req.body);
  
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

}
