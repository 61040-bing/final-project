import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {RoundTable, PopulatedRoundTable} from '../roundtable/model';

// Update this if you add a property to the RoundTable type!
type RoundTableResponse = {
  _id: string;
  author: string;
  petition: string;
  neighborhood: string;
  startDate: string;
  endDate: string;
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
 * Transform a raw RoundTable object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<RoundTable>} roundTable - A roundTable
 * @returns {RoundTableResponse} - The roundTable object formatted for the frontend
 */
const constructRoundTableResponse = (roundTable: HydratedDocument<RoundTable>): RoundTableResponse => {
  const roundTableCopy: PopulatedRoundTable = {
    ...roundTable.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {email} = roundTableCopy.authorId;
  delete roundTableCopy.authorId;
  return {
    ...roundTableCopy,
    _id: roundTableCopy._id.toString(),
    author: email,
    petition:roundTableCopy.petitionId.toString(),
    neighborhood: roundTableCopy.neighborhoodId.name,
    startDate: formatDate(roundTable.startDate),
    endDate:formatDate(roundTable.endDate),
    dateCreated: formatDate(roundTable.dateCreated)
  };
};

export {
  constructRoundTableResponse
};
