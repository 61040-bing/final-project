import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comments/collection';

/**
 * Checks if a comment with commentId is req.params exists
 */
const isCommentExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.commentId);
  const comment = validFormat ? await CommentCollection.findOne(req.params.commentId) : '';
  if (!comment) {
    res.status(404).json({
      error: {
        commentNotFound: `Comment with comment ID ${req.params.commentId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the comment in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidCommentContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Comment content must be at least one character long.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the comment whose commentId is in req.params
 */
const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
  const comment = await CommentCollection.findOne(req.params.commentId);
  const userId = comment.authorId._id;

  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' comments.'
    });
    return;
  }

  next();
};

export {
  isValidCommentContent,
  isCommentExists,
  isValidCommentModifier
};
