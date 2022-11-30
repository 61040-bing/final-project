import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Petition, PopulatedPetition} from './model';

// Update this if you add a property to the Freet type!
type PetitionResponse = {
  _id: string;
  author: string;
  neighborhood:string;
  dateCreated: string;
  title: string;
  content: string;
  targetSignatures: string;
  submitted: string;
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
  const {email} = petitionCopy.authorId;
  const {name} = petitionCopy.neighborhoodId;
  delete petitionCopy.authorId;
  return {
    ...petitionCopy,
    _id: petitionCopy._id.toString(),
    author: email,
    neighborhood: name,
    dateCreated: formatDate(petition.dateCreated),
    targetSignatures: petitionCopy.targetSignatures.toString(),
    submitted: petitionCopy.submitted.toString()
  };
};

export {
  constructPetitionResponse
};
