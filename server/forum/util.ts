import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Forum, PopulatedForum} from './model';
import {User} from "../user/model";
import {Neighborhood} from "../neighborhood/model";

// Update this if you add a property to the Forum type!
type ForumResponse = {
  _id: string;
  author: User;
  dateCreated: string;
  content: string;
  dateModified: string;
  expiryDate: string;
  neighborhood: Neighborhood;
  qna: boolean;
  petitionId: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Forum object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Forum>} Forum - A Forum
 * @returns {ForumResponse} - The Forum object formatted for the frontend
 */
const constructForumResponse = (Forum: HydratedDocument<Forum>): ForumResponse => {
  const ForumCopy: PopulatedForum = {
    ...Forum.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const author = ForumCopy.authorId;
  delete ForumCopy.authorId;
  const neighborhood = ForumCopy.neighborhoodId;
  delete ForumCopy.neighborhoodId;
  return {
    ...ForumCopy,
    _id: ForumCopy._id.toString(),
    author,
    neighborhood,
    dateCreated: formatDate(Forum.dateCreated),
    dateModified: formatDate(Forum.dateModified),
    expiryDate: formatDate(Forum.expiryDate),
    petitionId: Forum.linkedPetition ? Forum.linkedPetition.toString() : ""
  };
};

export {
  constructForumResponse
};
