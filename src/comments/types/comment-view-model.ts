import { LikeStatus } from "../domain/likes.entity";

export type CommentViewModel = {
  id:	string;
  content:	string;
  commentatorInfo: {
    userId: string;  
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  }
}
