import type {HydratedDocument, Types} from 'mongoose';
import type {RoundTable} from './model';
import RoundTableModel from './model';
import UserCollection from '../user/collection';
import NeighborhoodCollection from '../petition/collection';

/**
 * This files contains a class that has the functionality to explore RoundTables
 * stored in MongoDB, including adding, finding, and deleting roundTables.
 *
 */
class RoundTableCollection {
  /**
   * Add a roundTable to the collection
   *
   * @param {string} authorId - The id of the author of the roundTable
   * @param {string} petition - The id of the petition
   * @param {string} neighborhood - The id of the neigborhood
   * @param {Date} startDate  - The start Date of the RoundTable
   * @param {Date} endDate  - The end Date of the RoundTable
   * @return {Promise<HydratedDocument<RoundTable>>} - The newly created roundtable
   */
  static async addOne(authorId: Types.ObjectId | string, petition: Types.ObjectId | string,
    neighborhood: Types.ObjectId | string, startDate: Date, endDate: Date): Promise<HydratedDocument<RoundTable>> {
    const date = new Date();
    const roundTable = new RoundTableModel({
      authorId,
      petition,
      neighborhood,
      startDate,
      endDate,
      dateCreated: date,

    });
    await roundTable.save(); // Saves roundtable to MongoDB
    return roundTable.populate('authorId');
  }


  /**
   * Find a RoundTable by roundTableId
   *
   * @param {string} roundTableId - The id of the RoundTable to find
   * @return {Promise<HydratedDocument<RoundTable>> | Promise<null> } - The RoundTable with the given roundTableId, if any
   */
  static async findOne(roundTableId: Types.ObjectId | string): Promise<HydratedDocument<RoundTable>> {
    return RoundTableModel.findOne({_id: roundTableId}).populate('authorId');

  }

  /**
   * Get all the RoundTables in the database (i.e. on all Petitions by all users)
   *
   * @return {Promise<HydratedDocument<RoundTable>[]>} - An array of all of the RoundTables
   */
  static async findAll(): Promise<Array<HydratedDocument<RoundTable>>> {
    // Retrieves RoundTables and sorts them from most to least recent
    return RoundTableModel.find({}).sort({dateCreated: -1}).populate('authorId');

  }

  /**
   * Get all the RoundTables in by given author
   *
   * @param {string} email - The email of author of the RoundTables
   * @return {Promise<HydratedDocument<RoundTable>[]>} - An array of all of the RoundTable
   */
  static async findAllByEmail(email: string): Promise<Array<HydratedDocument<RoundTable>>> {
    const author = await UserCollection.findOneByEmail(email);
    return RoundTableModel.find({authorId: author._id}).populate('authorId');

  }

  /**
   * Get all the RoundTables in by given author 
   *
   * @param {string} userId - The id of author of the RoundTables
   * @return {Promise<HydratedDocument<RoundTable>[]>} - An array of all of the RoundTables
   */
 static async findAllByUserId(userId: Types.ObjectId |string): Promise<Array<HydratedDocument<RoundTable>>> {
  const author = await UserCollection.findOneByUserId(userId);
  return RoundTableModel.find({authorId: author._id}).populate('authorId');

}

  /**
   * Get all the RoundTables on a Petition
   * 
   * @param {string} petitionId - The Id of the Petition
   * @returns Promise<Array<HydratedDocument<Petition>>> - An array of all the Petitions
   */
  static async findAllbyPetitionId(petitionId: Types.ObjectId | string): Promise<Array<HydratedDocument<RoundTable>>>{
    const petition = await NeighborhoodCollection.findOne(petitionId);
    return RoundTableModel.find({petitionId: petition._id}).populate('_id');
  }

/**
   * Get all the RoundTables in a Neighborhood
   * 
   * @param {string} neighborhoodId - The Id of the Petition
   * @returns Promise<Array<HydratedDocument<RoundTable>>> - An array of all the RoundTables
   */
 static async findAllbyNeighborhoodId(neighborhoodId: Types.ObjectId | string): Promise<Array<HydratedDocument<RoundTable>>>{
  const neighborhood = await NeighborhoodCollection.findOne(neighborhoodId);
  return RoundTableModel.find({neighborhoodId: neighborhood._id}).populate('_id');
}

  /**
   * Delete a RoundTable with given roundTableId.
   *
   * @param {string} roundTableId - The roundTableId of roundTable to delete
   * @return {Promise<Boolean>} - true if the roundTable has been deleted, false otherwise
   */
  static async deleteOne(roundTableId: Types.ObjectId | string): Promise<boolean> {
    const roundTable = await RoundTableModel.deleteOne({_id: roundTableId});
    return roundTable !== null;
  }

  /**
   * Delete all the RoundTables by the given author
   *
   * @param {string} authorId - The id of author of RoundTables
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await RoundTableModel.deleteMany({authorId});
  }

  /**
   * Delete all the RoundTables on a petition
   * @param {string} petitionId - The id of the Petition whose RoundTables are being deleted
   */
  static async deleteManybyPetitionId(petitionId: Types.ObjectId | string ):Promise<void>{
    await RoundTableModel.deleteMany({petitionId: petitionId})
  }

}



export default RoundTableCollection;
