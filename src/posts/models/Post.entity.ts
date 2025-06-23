import { Types } from "mongoose";
import { CreatePostDto } from "../dto/post.create-dto";
import { PostDocument, PostModel } from "../domain/post.entity";
import { LikeStatus } from "../domain/likes.entity";

export class NewestLikesEntity {
  addedAt: Date = new Date();

  constructor(
    public userId: string, 
    public login: string,
  ) {}
}

export class PostEntity {
  createdAt: Date = new Date();
  deletedAt: Date | null = null;
  extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    newestLikes: [] as NewestLikesEntity[],
  };
 
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: Types.ObjectId,
    public blogName: string,
  ){}
 
  static createPost(dto: CreatePostDto){
    return new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: dto.blogName
    }) as PostDocument
  }

  updatePostInfo( title: string, shortDescription: string, content: string, blogId: Types.ObjectId): void {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
  }

  markAsDeleted(): void {
    this.deletedAt = new Date();
  }

  updateLikesInfo ( 
    likeStatus: LikeStatus, 
    userPostStatus: LikeStatus | undefined,
    userId: string, 
    login: string
  ): void {

    switch (likeStatus) {
      case LikeStatus.None:
        this.extendedLikesInfo.likesCount > 0 && this.extendedLikesInfo.likesCount--;
        this.extendedLikesInfo.dislikesCount > 0 && this.extendedLikesInfo.dislikesCount--;
        break;

      case LikeStatus.Like:
        if (userPostStatus === LikeStatus.Dislike && this.extendedLikesInfo.dislikesCount > 0) {
          this.extendedLikesInfo.dislikesCount--;
        }
        this.extendedLikesInfo.likesCount++;

        break;

      case LikeStatus.Dislike:
        if (userPostStatus === LikeStatus.Like && this.extendedLikesInfo.likesCount > 0) {
          this.extendedLikesInfo.likesCount--;
        }
        this.extendedLikesInfo.dislikesCount++;
        break;
    }
  }
    
  updateNewestLikes( newestLikes: NewestLikesEntity[]): void {
    this.extendedLikesInfo.newestLikes = newestLikes;
  }

}