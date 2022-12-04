import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding, finding, updating, and deleting likes.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Like> is the output of the LikeModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} authorId - The id of the author of the like
   * @param itemId
   * @return {Promise<HydratedDocument<like>>} - The newly created like
   */
  static async addOne(authorId: Types.ObjectId | string, itemId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      authorId,
      itemId
    });
    await like.save(); //
    return like.populate('authorId');
  }

  /**
   * Find a like with given authorId and itemId.
   *
   * @param authorId
   * @param itemId
   */
  static async findOne(authorId: Types.ObjectId | string, itemId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const like = await LikeModel.findOne({authorId: authorId, itemId: itemId});
    if (like === null){
      return null;
    }
    await like.populate("authorId");
  }

  /**
   * Get all the likes by given author
   * @param {string} email - The username of author of the like
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAllByEmail(email: string): Promise<Array<HydratedDocument<Like>>> {
    const author = await UserCollection.findOneByEmail(email);
    return LikeModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the likes by given item
   * @return {Promise<HydratedDocument<Likes>[]>} - An array of all of the likes
   * @param itemId
   */
  static async findAllByItemId(itemId: string): Promise<Array<HydratedDocument<Like>>> {

    return LikeModel.find({itemId: itemId}).populate('authorId');
  }


  /**
   * Delete a like with given author_id and item_id.
   *
   * @param authorId
   * @param itemId
   * @return {Promise<Boolean>} - true if the item has been deleted, false otherwise
   */
  static async deleteOne(authorId: Types.ObjectId | string, itemId: Types.ObjectId | string): Promise<boolean> {
    const item = await LikeModel.deleteOne({authorId: authorId, itemId: itemId});
    return item !== null;
  }
}

export default LikeCollection;
