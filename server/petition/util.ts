import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Petition, PopulatedPetition} from './model';
import {User} from "../user/model";
import { Neighborhood } from 'server/neighborhood/model';

// Update this if you add a property to the forum type!
type PetitionResponse = {
  _id: string;
  author: User;
  neighborhood:Neighborhood;
  dateCreated: string;
  title: string;
  content: string;
  targetSignatures: string;
  submitted: string;
  accepted: string;
  denied: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw  object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Petition>} petition - A petition
 * @returns {PetitionResponse} - The petition object formatted for the frontend
 */
const constructPetitionResponse = (petition: HydratedDocument<Petition>): PetitionResponse => {
  const petitionCopy: PopulatedPetition = {
    ...petition.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {name} = petitionCopy.neighborhoodId;
  const author = petitionCopy.authorId;

  delete petitionCopy.authorId;
  // console.log("util response",{
  //   ...petitionCopy,
  //   _id: petitionCopy._id.toString(),
  //   author,
  //   neighborhood: petitionCopy.neighborhoodId,
  //   dateCreated: formatDate(petition.dateCreated),
  //   targetSignatures: petitionCopy.targetSignatures.toString(),
  //   submitted: petitionCopy.submitted.toString(),
  //   accepted: petitionCopy.accepted.toString(),
  //   denied: petitionCopy.denied.toString(),
  // })
  return {
    ...petitionCopy,
    _id: petitionCopy._id.toString(),
    author,
    neighborhood: petitionCopy.neighborhoodId,
    dateCreated: formatDate(petition.dateCreated),
    targetSignatures: petitionCopy.targetSignatures.toString(),
    submitted: petitionCopy.submitted.toString(),
    accepted: petitionCopy.accepted.toString(),
    denied: petitionCopy.denied.toString(),
  };
};

export {
  constructPetitionResponse
};
