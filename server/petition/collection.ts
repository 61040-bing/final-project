import type {HydratedDocument, Types} from 'mongoose';
import type {Petition} from './model';
import PetitionModel from './model';
import UserCollection from '../user/collection';
import NeighborhoodCollection from '../neighborhood/collection';

/**
 * This files contains a class that has the functionality to explore petitions
 * stored in MongoDB, including adding, finding, updating, and deleting petitions.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Petition> is the output of the PetitionModel() constructor,
 * and contains all the information in Petition. https://mongoosejs.com/docs/typescript.html
 */
class PetitionCollection {
  /**
   * Add a Petition to the collection
   *
   * @param {string} authorId - The id of the author of the petition
   * @param {string} neighborhoodId - The id of the neighborhood of the petition
   * @param {string} title - The title of the petition
   * @param {string} content - The content of the petition
   * @param {number} targetSignatures - The target number of Signatures of the petition
   * @return {Promise<HydratedDocument<Petition>>} - The newly created petition
   */
  static async addOne(authorId: Types.ObjectId | string, 
    neighborhoodId: Types.ObjectId | string, title: string, content: string,
    targetSignatures: number): Promise<HydratedDocument<Petition>> {
    const date = new Date();
    const petition = new PetitionModel({
      authorId,
      neighborhoodId,
      dateCreated: date,
      title,
      content,
      targetSignatures,
      submitted: false,
     
    });
    await petition.save(); // Saves petition to MongoDB
    return petition.populate('authorId');
  }

  /**
   * Find a petition by petitionId
   *
   * @param {string} petitionId - The id of the petition to find
   * @return {Promise<HydratedDocument<Petition>> | Promise<null> } - The petition with the given petitionId, if any
   */
  static async findOne(petitionId: Types.ObjectId | string): Promise<HydratedDocument<Petition>> {
    return PetitionModel.findOne({_id: petitionId}).populate('authorId');
  }

  /**
   * Get all the petitions in the database
   *
   * @return {Promise<HydratedDocument<Petition>[]>} - An array of all of the petitions
   */
  static async findAll(): Promise<Array<HydratedDocument<Petition>>> {
    // Retrieves petitions and sorts them from most to least recent
    return PetitionModel.find({}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the petitions in by given author
   *
   * @param {string} email - The email of author of the petitions
   * @return {Promise<HydratedDocument<Petition>[]>} - An array of all of the petitions
   */
  static async findAllByEmail(email: string): Promise<Array<HydratedDocument<Petition>>> {
    const author = await UserCollection.findOneByEmail(email);
    return PetitionModel.find({authorId: author._id}).sort({dateCreated: -1}).populate('authorId');
  }

/**
   * Get all the petitions in for a given neighborhood
   *
   * @param {string} neighborhoodId - The neighborhoodId
   * @return {Promise<HydratedDocument<Petition>[]>} - An array of all of the petitions for the neighborhood
   */
 static async findAllByNeighborhood(neighborhoodId: string): Promise<Array<HydratedDocument<Petition>>> {
  const neighborhood = await NeighborhoodCollection.findOne(neighborhoodId);
  return PetitionModel.find({neighborhood: neighborhood._id}).sort({dateCreated: -1}).populate('neighborhoodId').sort({dateCreated: -1});
}
  /**
   * Delete a petition with given petitionId.
   *
   * @param {string} petitionId - The petitionId of petition to delete
   * @return {Promise<Boolean>} - true if the petition has been deleted, false otherwise
   */
  static async deleteOne(petitionId: Types.ObjectId | string): Promise<boolean> {
    const petition = await PetitionModel.deleteOne({_id: petitionId});
    return petition !== null;
  }

  /**
   * Delete all the petitions by the given author
   *
   * @param {string} authorId - The id of author of petitions
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await PetitionModel.deleteMany({authorId});
  }
}

export default PetitionCollection;
