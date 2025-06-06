import { Request, Response } from "express";
import { CommentInputDto } from "../../comments/dto/comment.input-dto";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { PostsQueryRepository } from "../repositories/posts.query.repository";
import { UsersQueryRepository } from "../../users/repositories/users.query.repository";
import { CommentsService } from "../../comments/domain/comments.service";
import { CommentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import { PostInputDto } from "../dto/post.input-dto";
import { createErrorMessages } from "../../core/errors/error.utils";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { PostService } from "../domain/post.service";
import { setDefaultSortAandPagination } from "../../core/helpers/set-default-sort-and-pagination";
import { inject, injectable } from "inversify";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepository) public postsQueryRepository: PostsQueryRepository,
    @inject(UsersQueryRepository) public usersQueryRepository: UsersQueryRepository,
    @inject(CommentsService) public commentsService: CommentsService,
    @inject(CommentsQueryRepository) public commentsQueryRepository: CommentsQueryRepository,
    @inject(BlogsQueryRepository) public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostService) public postService: PostService
  ){}

async createPostComment (
  req: Request<{ postId: string }, {}, CommentInputDto>, 
  res: Response
){
  try {
    const postId = req.params.postId;

    const post = await this.postsQueryRepository.findByIdOrFail( postId );
    const user = await this.usersQueryRepository.findByIdOrFail( req.user?.id! );
    const createdCommentId = await this.commentsService.create (req.body, post, user );
    const commentViewModel = await this.commentsQueryRepository.findByIdOrFail( createdCommentId );
    
    res.status(HttpStatus.Created).send(commentViewModel); 
     
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}

async createPost (
  req: Request<{}, {}, PostInputDto>, 
  res: Response
){
  try {
    const blog = await this.blogsQueryRepository.findById(req.body.blogId);
    
    if (!blog) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ message: 'Post not found in blog', field: 'idBlog' }])
        );
      
      return;
    }

    const createdPostId = await this.postService.create(req.body, blog);
    const createdPost = await this.postsQueryRepository.findByIdOrFail(createdPostId);
      
    res.status(HttpStatus.Created).send(createdPost); 
     
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}

async deletePost (
  req: Request<{id: string}>, 
  res: Response
){
  try {
    const id = req.params.id;
    
    await this.postsQueryRepository.findByIdOrFail(id);
    await this.postService.delete(id);
    
    res.status(HttpStatus.NoContent).send();

  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}

async getPostComment (
  req: Request<{postId: string}>, 
  res: Response
){
  try {
    const id = req.params.postId;    
    const post = await this.postsQueryRepository.findByIdOrFail( id );

    const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req );    
    
    const comments = await this.commentsQueryRepository.getCommentsInPost( { pageNumber, pageSize, sortBy, sortDirection} , id );
    const commentsCount = await this.commentsQueryRepository.getCommentsInPostCount( id );
    const commentListOutput = await this.commentsQueryRepository.mapPaginationViewMdel(
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
}

async getPostList (req: Request, res: Response) {
  try {
    const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req ); 
    
    const posts = await this.postsQueryRepository.getPosts({ pageNumber, pageSize, sortBy, sortDirection });
    const postsCount = await this.postsQueryRepository.getPostsCount(); 
    const postListOutput = await this.postsQueryRepository.mapPaginationViewMdel({ posts, pageSize, pageNumber, postsCount });

    res.status(HttpStatus.Success).send(postListOutput);

  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}

async getPost (
  req: Request<{id: string}>, 
  res: Response
){
  try {
    const id = req.params.id;
    
    const post = await this.postsQueryRepository.findByIdOrFail(id);
    res.status(HttpStatus.Success).send(post);
  
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}

async updatePost (
  req: Request<{id: string}, {}, PostInputDto>, 
  res: Response
){
  try {
    const id = req.params.id;
   
    await this.postsQueryRepository.findByIdOrFail(id);
    await this.postService.update(id, req.body);
   
    res.status(HttpStatus.NoContent).send();

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

}
