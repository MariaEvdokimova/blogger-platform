import { Request, Response } from "express";
import { CommentInputDto } from "../../comments/dto/comment.input-dto";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { PostsQueryRepository } from "../repositories/posts.query.repository";
import { CommentsService } from "../../comments/application/comments.service";
import { CommentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import { PostInputDto } from "../dto/post.input-dto";
import { createErrorMessages } from "../../core/errors/error.utils";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { PostService } from "../application/post.service";
import { setDefaultSortAandPagination } from "../../core/helpers/set-default-sort-and-pagination";
import { inject, injectable } from "inversify";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { CommentsLikesQueryRepository } from "../../comments/repositories/comment-likes.query.repository";
import { LikeStatus } from "../../comments/domain/likes.entity";
import { AuthService } from "../../auth/application/auth.service";
import { ResultStatus } from "../../core/result/resultCode";
import { PostLikeStatusInputDto } from "../dto/post-like-status.input.dto";
import { PostsLikesQueryRepository } from "../repositories/post-likes.query.repository";
import { UsersQueryRepository } from "../../users/repositories/users.query.repository";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepository) public postsQueryRepository: PostsQueryRepository,
    @inject(CommentsService) public commentsService: CommentsService,
    @inject(CommentsQueryRepository) public commentsQueryRepository: CommentsQueryRepository,
    @inject(BlogsQueryRepository) public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostService) public postService: PostService,
    @inject(CommentsLikesQueryRepository) public CommentsLikesQueryRepository: CommentsLikesQueryRepository,
    @inject(AuthService) public AuthService: AuthService,
    @inject(PostsLikesQueryRepository) public PostsLikesQueryRepository: PostsLikesQueryRepository,
    @inject(UsersQueryRepository) public UsersQueryRepository: UsersQueryRepository,
  ){}

async createPostComment (
  req: Request<{ postId: string }, {}, CommentInputDto>, 
  res: Response
){
  try {
    const postId = req.params.postId;

    const post = await this.postsQueryRepository.findById( postId );
    if ( !post ) {
      throw new EntityNotFoundError();
    }

    const createdCommentId = await this.commentsService.create (req.body, post, req.user?.id! );
    const comment = await this.commentsQueryRepository.findById( createdCommentId );
    if ( !comment ) {
      throw new EntityNotFoundError();
    }

    const commentWithMyStatus = {
      ...comment,
      likesInfo: {
        ...comment.likesInfo,
        myStatus: LikeStatus.None
      }
    };

    const commentViewModel = this.commentsQueryRepository.getInView( commentWithMyStatus );
 
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

    const post = await this.postService.create(req.body, blog);
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

    await this.postService.delete(id);
    
    res.status(HttpStatus.NoContent).send();

  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}

async getPostComments (
  req: Request<{postId: string}>, 
  res: Response
){
  try {
    const id = req.params.postId;    
    const post = await this.postsQueryRepository.findById( id );
    if ( !post ) {
      throw new EntityNotFoundError();
    }

    let userId = null;
      if (req.headers.authorization) {
        const result = await this.AuthService.checkAccessToken(req.headers.authorization);
                
        if (result.status === ResultStatus.Success) {
          userId = result.data!.id;
        }
      }

    const { pageNumber, pageSize, sortBy, sortDirection } = setDefaultSortAandPagination( req );    
    
    const comments = await this.commentsQueryRepository.getCommentsInPost( { pageNumber, pageSize, sortBy, sortDirection} , id );
    const commentsCount = await this.commentsQueryRepository.getCommentsInPostCount( id );

    const commentIds = comments.map(comment => comment._id);
    const likes = userId 
      ?await this.CommentsLikesQueryRepository.findByCommentIds(commentIds, userId)
      : [];

    //словарь для поиска статуса лайка
    const likesMap = new Map<string, LikeStatus>(
      likes.map(like => [like.commentId.toString(), like.status || LikeStatus.None])
    );

    const commentsWithMyStatus = comments.map(comment => ({
      ...comment,
      likesInfo: {
        ...comment.likesInfo,
        myStatus: likesMap.get(comment._id.toString()) || LikeStatus.None
      }
    }));

    const commentListOutput = await this.commentsQueryRepository.mapPaginationViewMdel(
      { 
        commentsWithMyStatus,
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
    
    let userId = null;
    if (req.headers.authorization) {
      const result = await this.AuthService.checkAccessToken(req.headers.authorization);
              
      if (result.status === ResultStatus.Success) {
        userId = result.data!.id;
      }
    }

    const posts = await this.postsQueryRepository.getPosts({ pageNumber, pageSize, sortBy, sortDirection });
    const postsCount = await this.postsQueryRepository.getPostsCount(); 

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
    
    let userId = null;
    if (req.headers.authorization) {
      const result = await this.AuthService.checkAccessToken(req.headers.authorization);
              
      if (result.status === ResultStatus.Success) {
        userId = result.data!.id;
      }
    }

    const post = await this.postsQueryRepository.findById(id);
    
    if ( !post ) {
      throw new EntityNotFoundError();
    }
    
    const likeStatus = userId
      ? await this.PostsLikesQueryRepository.findStatusByUserIdAndPostId( userId, id)
      : LikeStatus.None;

    const postWithMyStatus = {
      ...post,
      extendedLikesInfo: {
        ...post.extendedLikesInfo,
        myStatus: likeStatus || LikeStatus.None
      }
    };

    const postViewModel = this.postsQueryRepository.getInView( postWithMyStatus );
    
    res.status(HttpStatus.Success).send(postViewModel);
  
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
   
    await this.postService.update(id, req.body);
   
    res.status(HttpStatus.NoContent).send();

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

 async updateLikeStatus(
    req: Request<{postId: string}, {}, PostLikeStatusInputDto>, 
    res: Response
  ){
    try {
      const postId = req.params.postId;
      const user = await this.UsersQueryRepository.findById( req.user?.id!);
 
      await this.postService.updateLikeStatus( postId, req.body, req.user?.id!, user?.login! );   
  
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

}
