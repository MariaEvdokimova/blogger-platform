import { Types } from "mongoose";

export class CreateCommentDto {
  constructor(
    public content:	string,
    public userId: Types.ObjectId, 
    public userLogin: string,
    public postId: Types.ObjectId
  ) {}
}
