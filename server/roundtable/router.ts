import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import RoundTableCollection from './collection';
import * as userValidator from '../user/middleware';
import * as roundTableValidator from './middleware';
import * as petitionValidator from '../petition/middleware';
import * as util from './util';
import * as petitionutil from '../petition/util';
import PetitionCollection from '../petition/collection';

const router = express.Router();

/**
 * Get all the RoundTables for neighborhood
 *
 * @name GET /api/roundtables?neighborhoodId=id
 *
 * @return {RoundTableResponse[]} - A list of all the RoundTables sorted in descending
 *                      order by date added
* @throws {400} - If neighborhoodId is not given
 * @throws {404} - If no neighborhood has given neighborhoodId
 */
/**
 * Get roundTables by author.
 *
 * @name GET /api/roundtables?authorId=id
 *
 * @return {RoundTableResponse[]} - An array of RoundTables created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */

/**
 * Get RoundTables on petition.
 *
 * @name GET /api/roundtables?petitionId=id
 *
 * @return {Array<HydratedDocument<RoundTables>>} - RoundTables created on petition with id, petitionId
 * @throws {400} - If petitionId is not given
 * @throws {404} - If no petition has given petitionId
 *
 */

router.get(
  '/',
  [
    roundTableValidator.isNeighborhoodExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId  and petitionId query parameters was supplied
    if (req.query.author !== undefined  || req.query.petition !== undefined) { 
      next();
      return;
    }
    const neighborhoodRoundTables = await RoundTableCollection.findAllbyNeighborhoodId(req.query.neigborhood as string);
    const response = neighborhoodRoundTables.map(util.constructRoundTableResponse);
    res.status(200).json(response);
  },
  [
    roundTableValidator.isAuthorExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.petition !== undefined){
      next();
      return;
    }
    const authorRoundTables = await RoundTableCollection.findAllByEmail(req.query.author as string);
    const response = (authorRoundTables).map(util.constructRoundTableResponse);
    res.status(200).json(response);
  },
  [
    petitionValidator.isPetitionQueryExists,
  ],
  async (req: Request, res: Response) => {
   
    const petitionRoundTables = await RoundTableCollection.findAllbyPetitionId(req.query.petition as string);
    res.status(200).json(petitionRoundTables);
  }
);


/**
 * Create a new roundtable.
 *
 * @name POST /api/roundtables
 * 
 * @params petitionId
 * @params {string} neighborhood - The id
 * @params  {date} start date
 * @params {date} end date
 * @params {string} zoomlink
 * @return {RoundTableResponse} - The created roundtable
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already added 3 RoundTables on the Petition
 * @throws {400} - If start date is invalid
 *                 If end date is invalid
 *                 If end date < start date
 *                 if start date is in the past
 *                 if end date is in the past
 * 
 * @throws{404} - If the petitionId does not exist.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    roundTableValidator.isValidPetitionId,
    roundTableValidator.isValidRoundTableCreator,
    roundTableValidator.isValidRoundTableName,
    roundTableValidator.isAlreadyMaxRoundTables,
    roundTableValidator.isValidStartEndDates,
    roundTableValidator.isValidZoomlink
    
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const roundtable = await RoundTableCollection.addOne(userId, req.body.petitionId, req.body.neighborhoodId,
      req.body.roundTableName, req.body.startDate, req.body.endDate, req.body.zoomLink);

    res.status(201).json({
      message: 'Your RoundTable was created successfully.',
      roundtable: util.constructRoundTableResponse(roundtable)
    });
  }
);

/**
 * Delete a RoundTable
 *
 * @name DELETE /api/roundtables/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the roundtable
 * @throws {404} - If the roundtableId is not valid
 */

router.delete(
  '/:roundTableId?',
  [
    userValidator.isUserLoggedIn,
    roundTableValidator.isRoundTableExists,
    roundTableValidator.isValidRoundTableModifier
  ],
  async (req: Request, res: Response) => {
    await RoundTableCollection.deleteOne(req.params.roundTableId);
    res.status(200).json({
      message: 'Your RoundTable was deleted successfully.'
    });
  }
);


export {router as roundTableRouter};
