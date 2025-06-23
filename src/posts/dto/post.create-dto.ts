import { Types } from "mongoose";

export class CreatePostDto {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: Types.ObjectId,
    public blogName: string,
  ) {}
}
