import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Neighborhood} from '../neighborhood/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  // username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateJoined: Date;
  neighborhood: Types.ObjectId;
};

export type PopulatedUser = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateJoined: Date;
  neighborhoodId: Neighborhood;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
// The user's firstName
  firstName: {
    type: String,
    required: true
  }, 

  lastName: {
    type: String,
    required: true
  }, 
  // The user's email
  email: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  neighborhood:{
    type: Schema.Types.ObjectId,
    required: true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
