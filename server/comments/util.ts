import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from './model';
import {Types} from "mongoose";
import {Forum} from "../forum/model";
import {User} from "../user/model";


type CommentResponse = {
  _id: string;
  author: User;
  dateCreated: string;
  content: string;
  dateModified: string;
  parentId: Forum;

};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const author = commentCopy.authorId;
  delete commentCopy.authorId;
  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    author,
    dateCreated: formatDate(comment.dateCreated),
    dateModified: formatDate(comment.dateModified)
  };
};

export {
  constructCommentResponse
};
