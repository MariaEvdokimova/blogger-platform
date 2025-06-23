import { Request, Response } from "express";
import { BlogInputDto } from "../dto/blog.input-dto";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepository } from "../repositories/blogs.query.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { PostInBlogInputDto } from "../dto/post-in-blog.input-dto";
import { PostsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { setDefaultSortAandPagination } from "../../core/helpers/set-default-sort-and-pagination";
import { inject, injectable } from "inversify";
import { PostService } from "../../posts/application/post.service";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { LikeStatus } from "../../posts/domain/likes.entity";
import { ResultStatus } from "../../core/result/resultCode";
import { AuthService } from "../../auth/application/auth.service";
import { PostsLikesQueryRepository } from "../../posts/repositories/post-likes.query.repository";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) public blogsService: BlogsService,
    @inject(BlogsQueryRepository) public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository) public postsQueryRepository: PostsQueryRepository,
    @inject(PostService) public postService: PostService,
    @inject(AuthService) public AuthService: AuthService,
     @inject(PostsLikesQueryRepository) public PostsLikesQueryRepository: PostsLikesQueryRepository,
  ){}

  async createBlog (
    req: Request<{}, {}, BlogInputDto>, 
    res: Response
  ){
    try {    
      const createdBlogId = await this.blogsService.create(req.body);
      const createdBlog = this.blogsQueryRepository.getInView(createdBlogId);
      
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

      const blog = await this.blogsQueryRepository.findById(id);
      if ( !blog ) {
            throw new EntityNotFoundError();
          }

      const post = await this.postService.create({ ...req.body, blogId: blog!._id.toString()}, blog!);
      const createdPost = await this.postsQueryRepository.findById( post._id.toString() );
      if ( !createdPost ) {
        throw new EntityNotFoundError();
      }

      const postWithMyStatus = {
        ...createdPost,
        extendedLikesInfo: {
          ...createdPost.extendedLikesInfo,
          myStatus: LikeStatus.None
        }
      };

      const postViewModel = this.postsQueryRepository.getInView(postWithMyStatus);

      res.status(HttpStatus.Created).send(postViewModel);
      
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
      
      let userId = null;
      if (req.headers.authorization) {
        const result = await this.AuthService.checkAccessToken(req.headers.authorization);
                
        if (result.status === ResultStatus.Success) {
          userId = result.data!.id;
        }
      }      

      const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req ); 

      const searchNameTerm = blog!.id;

      const posts = await this.postsQueryRepository.getPosts({ pageNumber, pageSize, sortBy, sortDirection, searchNameTerm });
      const postsCount = await this.postsQueryRepository.getPostsCount( searchNameTerm ); 

      const postIds = posts.map(post => post._id);
      const likes = userId 
        ?await this.PostsLikesQueryRepository.findByPostIds(postIds, userId)
        : [];

      //словарь для поиска статуса лайка
      const likesMap = new Map<string, LikeStatus>(
        likes.map(like => [like.postId.toString(), like.status || LikeStatus.None])
      );

      const postsWithMyStatus = posts.map(post => ({
        ...post,
        extendedLikesInfo: {
          ...post.extendedLikesInfo,
          myStatus: likesMap.get(post._id.toString()) || LikeStatus.None
        }
      })); 

      const postListOutput = await this.postsQueryRepository.mapPaginationViewMdel({ posts: postsWithMyStatus, pageSize, pageNumber, postsCount });

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
    
      await this.blogsService.update(id, req.body);
  
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

}
