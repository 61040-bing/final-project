import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore Forums
 * stored in MongoDB, including adding, finding, updating, and deleting Forums.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Forum> is the output of the ForumModel() constructor,
 * and contains all the information in Forum. https://mongoosejs.com/docs/typescript.html
 */
class CommentCollection {
  /**
   * Add a Forum to the collection
   *
   * @param {string} authorId - The id of the author of the comment
   * @param {string} parentId - The id of the Forum the comment is attached to
   * @param {string} content - The id of the content of the comment
   * @return {Promise<HydratedDocument<Forum>>} - The newly created comment
   */
  static async addOne(authorId: Types.ObjectId | string, parentId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      parentId,
    });
    await comment.save(); // Saves Forum to MongoDB
    await comment.populate("parentId");
    return comment.populate('authorId');
  }

  /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Forum>> | Promise<null> } - The Forum with the given ForumId, if any
   */
  static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: commentId}).populate('authorId').populate('parentId');
  }

  /**
   * Get all the Forums in the database
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the Comments
   */
  static async findAll(): Promise<Array<HydratedDocument<Comment>>> {
    // Retrieves Forums and sorts them from most to least recent
    return CommentModel.find({}).sort({dateModified: -1}).populate('authorId').populate("parentId");
  }

  /**
   * Get all the Forums in the database
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the Comments
   */
  static async findCommentsByForumPost(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
    // Retrieves Forums and sorts them from most to least recent
    return CommentModel.find({parentId: parentId }).sort({dateModified: -1}).populate('authorId').populate("parentId");
  }

  /**
   * Get all the comments in by given author
   *
   * @return {Promise<HydratedDocument<Forum>[]>} - An array of all of the Forums
   * @param email
   */
  static async findAllByEmail(email: string): Promise<Array<HydratedDocument<Comment>>> {
    const author = await UserCollection.findOneByEmail(email);
    return CommentModel.find({authorId: author._id}).populate('authorId').populate('parentId');
  }

  /**
   * Update a Forum with the new content
   *
   * @param {string} commentId - The id of the Forum to be updated
   * @param {string} content - The new content of the Forum
   * @return {Promise<HydratedDocument<Forum>>} - The newly updated Forum
   */
  static async updateOne(commentId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const comment = await CommentModel.findOne({_id: commentId});
    comment.content = content;
    comment.dateModified = new Date();
    await comment.save();
    comment.populate('authorId');
    return comment.populate('parentId');
  }

  /**
   * Delete a comment with given commentId.
   *
   * @param {string} commentId - The ForumId of Forum to delete
   * @return {Promise<Boolean>} - true if the Forum has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const Forum = await CommentModel.deleteOne({_id: commentId});
    return Forum !== null;
  }

  /**
   * Delete all the Forums by the given author
   *
   * @param {string} authorId - The id of author of Forums
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await CommentModel.deleteMany({authorId});
  }
}

export default CommentCollection;
