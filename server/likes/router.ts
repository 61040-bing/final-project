import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as forumValidator from '../forum/middleware';
import * as likeValidator from '../likes/middleware';
import * as util from './util';

const router = express.Router();

/**
 *
 * @name GET /api/likes/postId
 *
 * @return {LikeResponse[]} - An array of likes created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
    '/:postId',
    [
        forumValidator.isForumPostExists,
    ],
    async (req: Request, res: Response) => {
        const allLikes = await LikeCollection.findAllByPostId(req.params.postId);
        const response = allLikes.map(util.constructLikeResponse);
        res.status(200).json(response);
    }
);

/**
 * Create a new like
 *
 * @name POST /api/likes/postId
 * returns an array of likes on specific post including added like
 *
 */
router.post(
    '/:postId',
    [
        userValidator.isUserLoggedIn,
        forumValidator.isForumPostExists,
        likeValidator.isLikeNotExists,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        await LikeCollection.addOne(userId, req.params.postId);
        const allLikes = await LikeCollection.findAllByPostId(req.params.postId);
        const response = allLikes.map(util.constructLikeResponse);
        res.status(200).json(response);

    }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:postId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the like
 * @throws {404} - If the likeId is not valid
 */
router.delete(
    '/:postId?',
    [
        userValidator.isUserLoggedIn,
        forumValidator.isForumPostExists,
        likeValidator.isLikeExists,
    ],
    async (req: Request, res: Response) => {
        await LikeCollection.deleteOne(req.session.userId as string, req.params.postId);

        const allLikes = await LikeCollection.findAllByPostId(req.params.postId);
        const response = allLikes.map(util.constructLikeResponse);
        res.status(200).json(response);
    }
);

export {router as likeRouter};
