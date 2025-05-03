import { ObjectId, WithId } from "mongodb";
import { commentCollection } from "../../db/mongo.db";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { Comment } from "../types/comment";
import { CommentViewModel } from "../types/comment-view-model";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";

export const commentsQueryRepository = {
  async getCommentsInPost( dto: PaginationQueryParamsDto, postId: string ): Promise<WithId<Comment>[]> {
    const { pageNumber, pageSize, sortBy, sortDirection } = dto;

    return commentCollection
      .find({ postId: new ObjectId(postId) })
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
      .toArray();
  },

  async getCommentsInPostCount( postId: string ): Promise<number> {
    return commentCollection.countDocuments({ postId: new ObjectId(postId) });
  },
  

  async findByIdOrFail(id: string): Promise<CommentViewModel | null> {
    this._checkObjectId(id);
    
    const comment = await commentCollection.findOne({ _id: new ObjectId(id)});
    
    if ( !comment ) {
      throw new EntityNotFoundError();
    }
    
    return comment ? this._getInView(comment) : null;
  },

  async mapPaginationViewMdel (
    dto: {
      comments: WithId<Comment>[], 
      pageSize: number, 
      pageNumber: number, 
      commentsCount: number,
    }
  ) {
    return {
      pagesCount: Math.ceil(dto.commentsCount / dto.pageSize),
      page: dto.pageNumber,
      pageSize: dto.pageSize,
      totalCount: dto.commentsCount,
      items: dto.comments.map(this._getInView)
    };
  },
  
  _getInView ( comment: WithId<Comment> ) {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId.toString(),
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt
    }
  },

  _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  },
};
