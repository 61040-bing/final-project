import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Petition} from '../petition/model';
import { Neighborhood } from 'server/neighborhood/model';

/**
 * This file defines the properties stored in a RoundTable
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for RoundTable on the backend
export type RoundTable = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  petitionId: Types.ObjectId;
  neighborhoodId: Types.ObjectId;
  roundTableName: string;
  startDate: Date;
  endDate: Date;
  zoomLink: string;
  dateCreated: Date;

};

export type PopulatedRoundTable = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  petitionId: Petition;
  neighborhoodId: Neighborhood;
  roundTableName: string;
  startDate: Date;
  endDate: Date;
  zoomLink: string;
  dateCreated: Date;

};

// Mongoose schema definition for interfacing with a MongoDB table
// roundtabless stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const RoundTableSchema = new Schema<RoundTable>({
  // The author (of RoundTable) userId
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

  neighborhoodId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Neighborhood'
  },
  roundTableName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  zoomLink: {
    type: String,
    required: true,
  },
  dateCreated:{
    type:Date,
    required: true
  },

});


const RoundTableModel = model<RoundTable>('RoundTable', RoundTableSchema);
export default RoundTableModel;
