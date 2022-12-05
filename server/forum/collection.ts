import type {HydratedDocument, Types} from 'mongoose';
import type {Forum} from './model';
import ForumModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore forums
 * stored in MongoDB, including adding, finding, updating, and deleting forums.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<forum> is the output of the ForumModel() constructor,
 * and contains all the information in forum. https://mongoosejs.com/docs/typescript.html
 */
class ForumCollection {
  /**
   * Add a forum post to the collection
   *
   * @param {string} authorId - The id of the author of the forum
   * @param {string} content - The id of the content of the forum
   * @param neighborhoodId
   * @param qna
   * @return {Promise<HydratedDocument<Forum>>} - The newly created forum
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, neighborhoodId: Types.ObjectId | string, qna: boolean, petitionId: Types.ObjectId | string): Promise<HydratedDocument<Forum>> {
    const date = new Date();
    const forum = new ForumModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      neighborhoodId: neighborhoodId,
      linkedPetition: petitionId,
      qna
    });
    await forum.save(); // Saves forum to MongoDB
    return forum.populate('authorId');
  }

  /**
   * Find a forum by forumId
   *
   * @param {string} forumId - The id of the forum to find
   * @return {Promise<HydratedDocument<Forum>> | Promise<null> } - The forum with the given forumId, if any
   */
  static async findOne(forumId: Types.ObjectId | string): Promise<HydratedDocument<Forum>> {
    return ForumModel.findOne({_id: forumId}).populate('authorId');
  }

  /**
   * Get all the forums in the database
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the forums
   */
  static async findAll(): Promise<Array<HydratedDocument<Forum>>> {
    // Retrieves forums and sorts them from most to least recent
    return ForumModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the forums in by given author
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the forums
   * @param email
   */
  static async findAllByEmail(email: string): Promise<Array<HydratedDocument<Forum>>> {
    const author = await UserCollection.findOneByEmail(email);
    return ForumModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the forum posts in by given author
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the forums
   * @param authorId
   */
  static async findAllByAuthorId(authorId: string): Promise<Array<HydratedDocument<Forum>>> {
    return ForumModel.find({authorId: authorId}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the forum posts in given neighborhood
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the forums
   * @param neighborhoodId
   */
  static async findAllByNeighborhoodId(neighborhoodId: string): Promise<Array<HydratedDocument<Forum>>> {
    return ForumModel.find({neighborhoodId}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Update a forum with the new content
   *
   * @param {string} forumId - The id of the forum to be updated
   * @param {string} content - The new content of the forum
   * @return {Promise<HydratedDocument<Forum>>} - The newly updated forum
   */
  static async updateOne(forumId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Forum>> {
    const forum = await ForumModel.findOne({_id: forumId});
    forum.content = content;
    forum.dateModified = new Date();
    await forum.save();
    return forum.populate('authorId');
  }

  /**
   * Delete a forum with given forumId.
   *
   * @param {string} forumId - The forumId of forum to delete
   * @return {Promise<Boolean>} - true if the forum has been deleted, false otherwise
   */
  static async deleteOne(forumId: Types.ObjectId | string): Promise<boolean> {
    const forum = await ForumModel.deleteOne({_id: forumId});
    return forum !== null;
  }

  /**
   * Delete all the forums by the given author
   *
   * @param {string} authorId - The id of author of forums
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ForumModel.deleteMany({authorId});
  }
}

export default ForumCollection;
