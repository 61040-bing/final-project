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
   * @param postId
   * @return {Promise<HydratedDocument<like>>} - The newly created like
   */
  static async addOne(authorId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      authorId,
      postId
    });
    await like.save(); //
    await like.populate("postId");
    return like.populate('authorId');
  }

  /**
   * Find a like with given authorId and postId.
   *
   * @param authorId
   * @param {string} likeId
   */
  static async findOne(authorId: Types.ObjectId | string, likeId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const like = await LikeModel.findOne({authorId: authorId, likeId: likeId});
    if (like === null){
      return null;
    }
    await like.populate("authorId");
    return like.populate("postId");
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
   * Get all the likes by given post
   * @return {Promise<HydratedDocument<Likes>[]>} - An array of all of the likes
   * @param postId
   */
  static async findAllByPostId(postId: string): Promise<Array<HydratedDocument<Like>>> {

    return LikeModel.find({postId: postId}).populate(['authorId', 'postId']);
  }


  /**
   * Delete a like with given author_id and post_id.
   *
   * @param authorId
   * @param {string} postId - The postId of post to delete
   * @return {Promise<Boolean>} - true if the post has been deleted, false otherwise
   */
  static async deleteOne(authorId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<boolean> {
    const post = await LikeModel.deleteOne({authorId: authorId, postId: postId});
    return post !== null;
  }
}

export default LikeCollection;
