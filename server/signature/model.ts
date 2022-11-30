import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Petition} from '../petition/model';

/**
 * This file defines the properties stored in a Signature
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Signature on the backend
export type Signature = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  petitionId: Types.ObjectId;
  dateCreated: Date;

};

export type PopulatedSignature = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  petitionId: Petition;
  dateCreated: Date;

};

// Mongoose schema definition for interfacing with a MongoDB table
// signatures stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SignatureSchema = new Schema<Signature>({
  // The author (of Signature) userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // petition that the user is signing
  petitionId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Petition'
  },

  dateCreated:{
    type:Date,
    required: true
  },

});


const SignatureModel = model<Signature>('Signature', SignatureSchema);
export default SignatureModel;
