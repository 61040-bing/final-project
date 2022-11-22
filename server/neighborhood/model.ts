import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Neighborhood = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    name: string;
    username: string;
    dateCreated: Date;
    description: string;
  };

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const NeighborhoodSchema = new Schema({
// TODO
  });
  
  const NeighborhoodModel = model<Neighborhood>('Neighborhood', NeighborhoodSchema);
  export default NeighborhoodModel;
  