import { LikeStatus } from "../domain/likes.entity";
import { NewestLikesEntity } from "../models/Post.entity";

export type PostViewModel = {
  id:	string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;    
    newestLikes: NewestLikesEntity[]
  }
}
