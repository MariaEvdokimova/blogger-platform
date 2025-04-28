import { Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { blogCollection, postCollection, userCollection } from "../../db/mongo.db";

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (_, res: Response) => {
  //truncate db
  await Promise.all([
    postCollection.deleteMany(),
    blogCollection.deleteMany(),
    userCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
