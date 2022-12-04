import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import {Forum} from "../Forum/model";

/**
 * This file defines the properties stored in a Forum
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Comment on the backend
export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  parentId: Types.ObjectId;// ID of parent Forum Post
  parentCommentId: Types.ObjectId;// ID of parent Forum Post
};

export type PopulatedComment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  parentId: Forum;// ID of parent Forum Post
  parentCommentId: Comment;// ID of parent Forum Post
};


const CommentSchema = new Schema<Comment>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the Forum was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the Forum
  content: {
    type: String,
    required: true
  },
  // The date the Forum was modified
  dateModified: {
    type: Date,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Forum'
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Comment'
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
