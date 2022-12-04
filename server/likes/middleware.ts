import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../likes/collection';




/**
 * Checks if the current user is the author of the like whose likeId is in req.params
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const like= await LikeCollection.findOne(req.session.userId, req.params.likeId);
  if (like === null){
    res.status(400).json({
      error: "Item was not liked by user"
    });
    return;
  }
  next();
};

/**
 * Checks if the current user does not like current like
 */
const isLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const like= await LikeCollection.findOne(req.session.userId, req.params.itemId);
  if (like !== null){
    res.status(400).json({
      error: "Item was already liked by user"
    });
    return;
  }
  next();
};

export {
  isLikeExists,
  isLikeNotExists
};
