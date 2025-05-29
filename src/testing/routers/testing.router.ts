import { Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { blacklistCollection, blogCollection, commentCollection, postCollection, sessionsCollection, userCollection } from "../../db/mongo.db";

export const testingRouter = Router({});

testingRouter.delete('', async (_, res: Response) => {
  //truncate db
  await Promise.all([
    postCollection.deleteMany(),
    blogCollection.deleteMany(),
    userCollection.deleteMany(),
    commentCollection.deleteMany(),
    blacklistCollection.deleteMany(),
    sessionsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
