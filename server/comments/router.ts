import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as commentValidator from '../comments/middleware';
import {isForumPostExists} from '../forum/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get comments by forumPostId.
 *
 * @name GET /api/comments/postId
 *
 * @return {CommentResponse[]} - An array of comments on post
 * @throws {400} - If postId is not given
 * @throws {404} - If no post has given postId
 *
 */
router.get(
  '/:postId',
  [
    isForumPostExists,
  ],
  async (req: Request, res: Response) => {
    const parentId = req.params.postId;
    const commentsForPost = await CommentCollection.findCommentsByForumPost(parentId);
    const response = commentsForPost.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new comment.
 *
 * @name POST /api/comments/postId
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 */

router.post(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    isForumPostExists,
    commentValidator.isValidCommentContent,
  ],
  async (req: Request, res: Response) => {
    const parentId = req.params.postId;
    let userId = (req.session.userId as string) ?? '';
    const comment = await CommentCollection.addOne(userId, parentId, req.body.content);
    await comment.populate('parentId');
    await comment.populate('authorId');
    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:commentId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the comment
 * @throws {404} - If the commentId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

/**
 * Modify a comment
 *
 * @name PUT /api/comments/:commentId
 *
 * @param {string} content - the new content for the comment
 * @return {CommentResponse} - the updated comment
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the comment
 * @throws {404} - If the commentId is not valid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 */
router.put(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
    const comment = await CommentCollection.updateOne(req.params.commentId, req.body.content);
    res.status(200).json({
      message: 'Your comment was updated successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

export {router as commentRouter};
