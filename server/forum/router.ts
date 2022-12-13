import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ForumCollection from './collection';
import * as userValidator from '../user/middleware';
import * as ForumValidator from '../forum/middleware';
import * as util from './util';
import * as neighborhoodValidator from '../neighborhood/middleware';

const router = express.Router();

/**
 * Get all the forum posts
 *
 * @name GET /api/forum
 *
 * @return {ForumResponse[]} - A list of all the forum posts sorted in descending
 *                      order by date modified
 */
/**
 * Get forum by neighborhood
 *
 * @name GET /api/forum?neighborhoodId=neighborhoodId
 *
 * @return {ForumResponse[]} - An array of forum posts created by user with authorId, author
 * @throws {400} - If neighborhood is not given
 * @throws {404} - If no neighborhood has given Id
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.neighborhoodId !== undefined || req.query.fetchAuthor !== undefined) {
      next();
      return;
    }

    const allPosts = await ForumCollection.findAll();
    const response = await Promise.all(allPosts.map(util.constructForumResponse));
    res.status(200).json(response);
  },
  [
    neighborhoodValidator.isNeighborhoodExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.fetchAuthor !== undefined) {
      next();
      return;
    }

    const authorPosts = await ForumCollection.findAllByNeighborhoodId(req.query.neighborhoodId as string);
    const response = await Promise.all(authorPosts.map(util.constructForumResponse));
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const authorPosts = await ForumCollection.findAllByAuthorId(req.session.userId as string);
    const response = await Promise.all(authorPosts.map(util.constructForumResponse));
    res.status(200).json(response);
  }
);

router.get(
  '/:id',
  async (req: Request, res: Response) => {
    const post = await ForumCollection.findOne(req.params.id);
    res.status(200).json({
      message: 'Your post was retrieved successfully.',
      forum: await util.constructForumResponse(post)
    });
  }
);

/**
 * Create a new Forum.
 *
 * @name POST /api/forum
 *
 * @param {string} content - The content of the Forum post
 *  @param {string} neighborhoodId - The ID of the neighborhood
 *  @param {boolean} qna - whether to create qna or not
 * @return {ForumResponse} - The created Forum
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the Forum content is empty or a stream of empty spaces
 * @throws {413} - If the Forum content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    ForumValidator.isValidForumPostContent,
    neighborhoodValidator.isNeighborhoodExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const post = await ForumCollection.addOne(userId, req.body.content, req.body.neighborhoodId, req.body.qna, req.body.petitionId);

    res.status(201).json({
      message: 'Your Forum was created successfully.',
      Forum: await util.constructForumResponse(post)
    });
  }
);

/**
 * Delete a Forum post
 *
 * @name DELETE /api/forum/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the Forum
 * @throws {404} - If the ForumId is not valid
 */
router.delete(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    ForumValidator.isForumPostExists,
    ForumValidator.isValidForumPostModifier
  ],
  async (req: Request, res: Response) => {
    await ForumCollection.deleteOne(req.params.postId);
    res.status(200).json({
      message: 'Your post was deleted successfully.'
    });
  }
);

/**
 * Modify a Forum
 *
 * @name PATCH /api/forum/:id
 *
 * @param {string} content - the new content for the Forum
 * @return {ForumResponse} - the updated Forum
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the Forum
 * @throws {404} - If the ForumId is not valid
 * @throws {400} - If the Forum content is empty or a stream of empty spaces
 */
router.patch(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    ForumValidator.isForumPostExists,
    ForumValidator.isValidForumPostModifier,
    ForumValidator.isValidForumPostContent
  ],
  async (req: Request, res: Response) => {
    const post = await ForumCollection.updateOne(req.params.postId, req.body.content);
    res.status(200).json({
      message: 'Your post was updated successfully.',
      Forum: await util.constructForumResponse(post)
    });
  }
);

export {router as forumRouter};
