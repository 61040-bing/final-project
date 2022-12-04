import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ForumCollection from '../Forum/collection';

/**
 * Checks if a ForumPost with ForumPostId is req.params exists
 */
const isForumPostExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.ForumPostId);
  const ForumPost = validFormat ? await ForumCollection.findOne(req.params.ForumPostId) : '';
  if (!ForumPost) {
    res.status(404).json({
      error: `ForumPost with ForumPost ID ${req.params.ForumPostId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the ForumPost in req.body is valid, i.e not a stream of empty
 * spaces
 */
const isValidForumPostContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'ForumPost content must be at least one character long.'
    });
    return;
  }
  next();
};

/**
 * Checks if the current user is the author of the ForumPost whose ForumPostId is in req.params
 */
const isValidForumPostModifier = async (req: Request, res: Response, next: NextFunction) => {
  const ForumPost = await ForumCollection.findOne(req.params.ForumPostId);
  const userId = ForumPost.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' ForumPosts.'
    });
    return;
  }

  next();
};

export {
  isValidForumPostContent,
  isForumPostExists,
  isValidForumPostModifier
};
