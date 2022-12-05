import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import {Neighborhood} from "../neighborhood/model";

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Forum = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  expiryDate: Date;
  neighborhoodId: Neighborhood;
  linkedPetition: Types.ObjectId;
  qna: boolean;
};

export type PopulatedForum = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  expiryDate: Date;
  neighborhoodId: Neighborhood;
  qna: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ForumSchema = new Schema<Forum>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  neighborhoodId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Neighborhood'
  },
  qna: {
    type: Boolean,
    default: false,
    required: true
  },
  linkedPetition: {
    type: Schema.Types.ObjectId,
    required: false
  }
});

const ForumModel = model<Forum>('Forum', ForumSchema);
export default ForumModel;
