import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { CommentDocument, CommentLean, CommentModel, CommentWithMyStatus } from "../domain/comment.entity";
import { CommentViewModel } from "../types/comment-view-model";

@injectable()
export class CommentsQueryRepository {
  async getCommentsInPost( dto: PaginationQueryParamsDto, postId: string ): Promise<CommentLean[]> {
    const { pageNumber, pageSize, sortBy, sortDirection } = dto;

    return CommentModel
      .find({ postId: new Types.ObjectId(postId), deletedAt: null })
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
      .lean()
  }

  async getCommentsInPostCount( postId: string ): Promise<number> {
    return CommentModel.countDocuments({ postId: new Types.ObjectId(postId), deletedAt: null });
  }  

  async findById(id: string ): Promise<CommentLean | null> {
    this._checkObjectId(id);
    return CommentModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null }).lean();
  }

  async mapPaginationViewMdel (
    dto: {
      commentsWithMyStatus: CommentWithMyStatus[], 
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
      items: dto.commentsWithMyStatus.map(this.getInView)
    };
  }
  
  getInView ( comment: CommentWithMyStatus ): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId.toString(),
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.myStatus,
      },
      createdAt: comment.createdAt
    }
  }

  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
};
