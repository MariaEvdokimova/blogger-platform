import { ObjectId, WithId } from "mongodb";
import { commentCollection } from "../../db/mongo.db";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { Comment } from "../types/comment";
import { CommentInputDto } from "../dto/comment.input-dto";
import { ForbiddenError } from "../../core/errors/forbidden.error";
import { injectable } from "inversify";

@injectable()
export class CommentsRepository {
  async findById(id: string): Promise<WithId<Comment> | null> {
    this._checkObjectId(id);
    return commentCollection.findOne({ _id: new ObjectId(id)});
  }

  async create( newComment: Comment): Promise<string> {
    const insertResult = await commentCollection.insertOne( newComment );
    return insertResult.insertedId.toString();
  } 

  async update(id: string, newComment: CommentInputDto) {
    this._checkObjectId(id);

    const updateResult = await commentCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: newComment
      }
    );
    
    if (updateResult.matchedCount < 1) {
      throw new EntityNotFoundError();
    }

    return;
  }

  async delete(id: string) {
    this._checkObjectId(id);
    
    const deleteResult = await commentCollection.deleteOne(
      {
        _id: new ObjectId(id)
      }
    );
    
    if ( deleteResult.deletedCount < 1 ) {
      throw new EntityNotFoundError();
    }

    return;
  }

  async verifyUserOwnership ( commentId: string, userId: string) {
    this._checkObjectId( userId );
    this._checkObjectId( commentId );

    const comment = await commentCollection.findOne({
      _id: new ObjectId(commentId),
      'commentatorInfo.userId': new ObjectId(userId)
    });

    if ( !comment ) {
      throw new ForbiddenError();
    }

  }
  
  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
