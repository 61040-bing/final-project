import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Petition, PopulatedPetition} from './model';
import {User} from "../user/model";
import { Neighborhood } from 'server/neighborhood/model';
import SignatureCollection from '../signature/collection';
import * as signatureUtil from '../signature/util';

// Update this if you add a property to the forum type!
type PetitionResponse = {
  _id: string;
  author: User;
  neighborhood: Neighborhood;
  dateCreated: string;
  title: string;
  content: string;
  targetSignatures: string;
  submitted: string;
  accepted: string;
  denied: string;
  signatures: signatureUtil.SignatureResponse[];
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
const constructPetitionResponse = async (petition: HydratedDocument<Petition>): Promise<PetitionResponse> => {
  const petitionCopy: PopulatedPetition = {
    ...petition.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {name} = petitionCopy.neighborhoodId;
  const author = petitionCopy.authorId;

  delete petitionCopy.authorId;
  const signaturesRaw = await SignatureCollection.findAllbyPetitionId(petitionCopy._id);
  const signatures = signaturesRaw.map(signatureUtil.constructSignatureResponse);
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
    signatures
  };
};

export {
  constructPetitionResponse
};
