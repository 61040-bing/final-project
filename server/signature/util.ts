import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Signature, PopulatedSignature} from '../signature/model';
import {User} from "../user/model";

// Update this if you add a property to the Signature type!
type SignatureResponse = {
  _id: string;
  author: User;
  petition: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Signature object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Signature>} signature - A signature
 * @returns {SignatureResponse} - The signature object formatted for the frontend
 */
const constructSignatureResponse = (signature: HydratedDocument<Signature>): SignatureResponse => {
  const signatureCopy: PopulatedSignature = {
    ...signature.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const author = signatureCopy.authorId;
  delete signatureCopy.authorId;
  return {
    ...signatureCopy,
    _id: signatureCopy._id.toString(),
    author,
    petition:signatureCopy.petitionId.toString(),
    dateCreated: formatDate(signature.dateCreated)
  };
};

export {
  constructSignatureResponse
};
