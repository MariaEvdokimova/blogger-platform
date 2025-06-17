import { Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserModel } from "../../users/domain/user.entity";
import { PostModel } from "../../posts/domain/post.entity";
import { BlogModel } from "../../blogs/domain/blog.entity";
import { CommentModel } from "../../comments/domain/comment.entity";
import { SecurityDeviceModel } from "../../securityDevices/domain/securityDevices.entity";
import { RateLimitModel } from "../../auth/domain/rate-limit.entity";

export const testingRouter = Router({});

testingRouter.delete('', async (_, res: Response) => {
  //truncate db
  await Promise.all([
    UserModel.deleteMany({}),
    PostModel.deleteMany({}),
    BlogModel.deleteMany({}),
    CommentModel.deleteMany({}),
    SecurityDeviceModel.deleteMany({}),
    RateLimitModel.deleteMany({}),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
