import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type { Neighborhood } from '../neighborhood/model';

/**
 * This file defines the properties stored in a Petition
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Petition on the backend
export type Petition = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  neighborhoodId: Types.ObjectId;
  dateCreated: Date;
  title: string;
  content: string;
  targetSignatures: number;
  submitted: boolean;
  accepted: boolean;
  denied: boolean;
};

export type PopulatedPetition = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  neighborhoodId: Neighborhood;
  dateCreated: Date;
  title: string;
  content: string;
  targetSignatures: number;
  submitted: boolean;
  accepted: boolean;
  denied: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Petitions stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PetitionSchema = new Schema<Petition>({
  // The author userId who created the petition
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  neighborhoodId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Neighborhood'
  },
  // The date the petition was created
  dateCreated: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  targetSignatures: {
    type: Number,
    required: true
  },
  submitted: {
    type: Boolean,
    required: true
  },  
  accepted: {
    type: Boolean,
  },  
  denied: {
    type: Boolean,
  },  

});

const PetitionModel = model<Petition>('Petition', PetitionSchema);
export default PetitionModel;
