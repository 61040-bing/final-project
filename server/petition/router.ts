import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PetitionCollection from './collection';
import SignatureCollection from '../signature/collection';
import RoundTableCollection from '../roundtable/collection';
import * as userValidator from '../user/middleware';
import * as petitionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the petitions
 *
 * @name GET /api/petitions
 *
 * @return {PetitionResponse[]} - A list of all the petitions sorted in descending
 *                      order by date created
 */
/**
 * Get petitions by neighborhood.
 *
 * @name GET /api/petitions?neighborhood=id
 *
 * @return {PetitionResponse[]} - An array of petitions created by user with email, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if neighborhood query parameter was supplied
    if (req.query.neighborhood !== undefined) {
      next();
      return;
    }
    const allPetitions = await PetitionCollection.findAll();
    const response = allPetitions.map(util.constructPetitionResponse);
    res.status(200).json(response);
  },
  [
    petitionValidator.isNeighborhoodExists
  ],
  async (req: Request, res: Response) => {
    const neighborhoodPetitions = await PetitionCollection.findAllByNeighborhood(req.query.neighborhood as string);
    const response = neighborhoodPetitions.map(util.constructPetitionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new petition.
 *
 * @name POST /api/petitions
 * @param {string} neighborhoodId - The neighborhood of the petition which dictates who can sign it
 * @param {string} title - The title of the petition
 * @param {string} content - The content of the petition
 * @param {string} targetSignatures - The target number of Signatures of the petition
 * @return {PetitionResponse} - The created petition
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the petition content is empty or a stream of empty spaces
 * @throws {400} - If the petition title is empty or a stream of empty spaces
//  * @throws {413} - If the petition content is more than 140 characters long // TODO: CONFIRM THIS
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    petitionValidator.isValidPetitionTitle,
    petitionValidator.isValidPetitionContent,
    petitionValidator.isValidPetitionTargetSignatures
    //only create if neighborhood = cuser's neighborhood/city

  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const petition = await PetitionCollection.addOne(userId, req.body.neighborhoodId, 
      req.body.title, req.body.content, parseInt(req.body.targetSignatures));

    res.status(201).json({
      message: 'Your petition was created successfully.',
      petition: util.constructPetitionResponse(petition)
    });
  }
);

/**
 * Delete a petition
 *
 * @name DELETE /api/petitions/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the petition
 * @throws {404} - If the petitionId is not valid
 */
router.delete(
  '/:petitionId?',
  [
    userValidator.isUserLoggedIn,
    petitionValidator.isPetitionExists,
    petitionValidator.isValidPetitionModifier
  ],
  async (req: Request, res: Response) => {
    await PetitionCollection.deleteOne(req.params.petitionId);
    await SignatureCollection.deleteManybyPetitionId(req.params.petitionId);
    await RoundTableCollection.deleteManybyPetitionId(req.params.petitionId);
    res.status(200).json({
      message: 'Your petition was deleted successfully.'
    });
  }
);

// MODIFICATION OF PETITION CONTENT IS NOT ALLOWED AS PEOPLE HAVE ALREADY STARTED SIGNING

export {router as petitionRouter};
