import type {Request, Response} from 'express';
import express from 'express';
import NeighborhoodCollection from './collection';
import * as neighborhoodValidator from "./middleware";
import type { Neighborhood } from './model';
import * as util from './util';



const router = express.Router();



/**
 * Get all the Neighborhoods
 *
 * @name GET /api/neighborhood
 *  @throws ?
 * @return {NeighborhoodResponse[]} - A list of all the neighborhoods
 *
 */
router.get(
    '/',
    [
    ],
    async (req: Request, res: Response) => {
        const neighborhoods = await NeighborhoodCollection.findAll();
        const response = neighborhoods.map(util.constructNeighborhoodResponse);
        res.status(200).json(response);
    }
);



/**
 * Get neighborhood object with ID
 *
 * @name GET /api/neighborhood/:neighborhoodId
 *  @throws ?
 * @return {NeighborhoodResponse} - The given neighborhood
 *
 */
router.get(
    '/:neighborhoodId',
    [
    ],
    async (req: Request, res: Response) => {
        const neighborhood = await NeighborhoodCollection.findOne(req.params.neighborhoodId);
        const response = util.constructNeighborhoodResponse(neighborhood);
        res.status(200).json(response);
    }
);

/**
 * Create a new Neighborhood
 *
 * @name POST /api/neighborhood
 *
 * @param {string} name - The name of neighborhood
 * @param {string} description - The description
 * of neighborhood
 * @return {NeighborhoodResponse} - The created neighborhood
 * @throws {400} - If neighborhood name already exists
 * @throws {401} - If the user is not authorized to modify neighborhoods
 */
router.post(
    '/',
    [
        //TODO: Function to check if user is valid modifier
        neighborhoodValidator.isNeighborhoodNameNotExists
    ],
    async (req: Request, res: Response) => {
        const neighborhood = await NeighborhoodCollection.addOne(req.body.name, req.body.description);
        const response = util.constructNeighborhoodResponse(neighborhood);
        res.status(200).json(response);
    }
);

/**
 * Delete a neighborhood
 *
 * @name DELETE /api/neighborhood
 *
 * @return {string} - A success message
 * @throws {401} - If the user is not authorized to modify neighborhoods
 * @throws {404} - If the neighborhoodId is not valid
 */
router.delete(
    '/:neighborhoodId?',
    [
        //TODO: Function to check if user is valid modifier
        neighborhoodValidator.isNeighborhoodExists
    ],
    async (req: Request, res: Response) => {
        await NeighborhoodCollection.deleteOne(req.params.neighborhoodId);
        res.status(200).json({
            message: 'Your neighborhood was deleted successfully.'
        });
    }
);

/**
 * Modify a neighborhood
 *
 * @name PUT /api/neighborhood
 *
 * @param {string} content and or {string} description- the new information of neighborhood
 * @return {NeighborhoodResponse} - the updated Neighborhood
 * @throws {400} - If neighborhood name already exists
 */
router.put(
    '/:neighborhoodId?',
    [
        neighborhoodValidator.isNeighborhoodExists
    ],
    async (req: Request, res: Response) => {
        let neighborhood;
        if (req.body.name !== null){
            neighborhood = await NeighborhoodCollection.updateName(req.params.neighborhoodId,req.body.name);
        }
        if (req.body.description !== null){
            neighborhood = await NeighborhoodCollection.updateDescription(req.params.neighborhoodId,req.body.description);
        }
        res.status(200).json({
            message: 'Your neighborhood was updated successfully.',
            neighborhood: util.constructNeighborhoodResponse(neighborhood)
        });
    }
);

/**
 * Get neighborhood in wall of honor
 * @name GET /api/neighborhood/honor
 *  @throws ?
 * @return {NeighborhoodResponse} - the Neighborhood on wall of honor
 */
router.get(
    '/honor',
    [
    ],
    async (req: Request, res: Response) => {
        const neighborhoods = await NeighborhoodCollection.findAll();
        const response =util.constructNeighborhoodResponse(neighborhoods[0]);
        //TODO calculations for wall of honor
        res.status(200).json(response);
    }
);


export {router as neighborhoodRouter};