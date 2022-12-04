import type {HydratedDocument} from 'mongoose';
import type {Like, PopulatedLike} from './model';
import {Types} from "mongoose";
import {Forum} from "../forum/model";
import {User} from "../user/model";


type LikeResponse = {
  _id: string;
  author: User;
  parentPost: Forum;
};


/**
 * Transform a raw like object from the database into an object
 * with all the information needed by the frontend
 *
 * @returns {LikeResponse} - The like object formatted for the frontend
 * @param like
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const parent  = likeCopy.postId;
  delete likeCopy.postId;
  const author = likeCopy.authorId;
  delete  likeCopy.authorId;

  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    parentPost: parent,
    author
  };
};

export {
  constructLikeResponse
};
