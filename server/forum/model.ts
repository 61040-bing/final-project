import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Forum
 */


export type Forum = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

export type PopulatedForum = {
  _id: Types.ObjectId;
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};


const ForumSchema = new Schema<Forum>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the forum post was created
  dateCreated: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // The date the forum post was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const ForumModel = model<Forum>('Forum', ForumSchema);
export default ForumModel;
