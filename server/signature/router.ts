import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SignatureCollection from './collection';
import * as userValidator from '../user/middleware';
import * as signatureValidator from './middleware';
import * as petitionValidator from '../petition/middleware';
import * as util from './util';
import * as petitionutil from '../petition/util';
import PetitionCollection from '../petition/collection';

const router = express.Router();

/**
 * Get all the Signatures for user signed in
 *
 * @name GET /api/signatures
 *
 * @return {SignatureResponse[]} - A list of all the signatures sorted in descending
 *                      order by date added
 * @throws {403} - If the user is not logged in

 */
/**
 * Get signatures by author.
 *
 * @name GET /api/signatures?authorId=id
 *
 * @return {SignatureResponse[]} - An array of signatures created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */

/**
 * Get signatures on petition.
 *
 * @name GET /api/signatures?petitionId=id
 *
 * @return {Array<HydratedDocument<Signatures>>} - Signatures created on petition with id, petitionId
 * @throws {400} - If petitionId is not given
 * @throws {404} - If no petition has given petitionId
 *
 */

router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId  and petitionId query parameters was supplied
    if (req.query.author !== undefined  || req.query.petition !== undefined) { 
      next();
      return;
    }
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const authorSignatures = await SignatureCollection.findAllByUserId(userId);
    const petitions = await Promise.all(authorSignatures.map(item => PetitionCollection.findOne(item.petitionId)));
    const response = petitions.map(petitionutil.constructPetitionResponse);
    res.status(200).json(response);
  },
  [
    signatureValidator.isAuthorExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.petition !== undefined){
      next();
      return;
    }
    const authorSignatures = await SignatureCollection.findAllByEmail(req.query.author as string);
    const response = (authorSignatures).map(util.constructSignatureResponse);
    res.status(200).json(response);
  },
  [
    petitionValidator.isPetitionQueryExists,
  ],
  async (req: Request, res: Response) => {
   
    const petitionSignatures = await SignatureCollection.findAllbyPetitionId(req.query.petition as string);
    res.status(200).json(petitionSignatures);
  }
);


/**
 * Create a new signature.
 *
 * @name POST /api/signatures: petitionId
 *
 * @return {SignatureResponse} - The created signature
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already added a Signature on the Petition
 * @throws{404} - If the petitionId does not exist.
 * @throws {403} - If the user tries to sign a petition in a neighborhood that is not theirs
 */
router.post(
  '/:petitionId',
  [
    userValidator.isUserLoggedIn,
    petitionValidator.isPetitionExists,
    signatureValidator.isUserAlreadySigning,
    // cannot sign a submitted petition - handled in front end by removing option
    signatureValidator.isPetitionInUserNeighborhood,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const signature = await SignatureCollection.addOne(userId, req.params.petitionId);
    await SignatureCollection.submitPetitionIfTargetReached(req.params.petitionId);
    res.status(201).json({
      message: 'Your Signature was created successfully.',
      signature: util.constructSignatureResponse(signature)
    });
    
  }
);

/**
 * Delete a Signature
 *
 * @name DELETE /api/signatures/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the signature
 * @throws {404} - If the signatureId is not valid
 */

router.delete(
  '/:petitionId?',
  [
    userValidator.isUserLoggedIn,
    signatureValidator.isSignatureExists,
    petitionValidator.isPetitionExists,
    signatureValidator.isValidSignatureModifier
    // cannot delete is submitted - delete option is hidden for creator in frontend
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    await SignatureCollection.deleteOnebyPetitionID(req.params.petitionId, userId);
    res.status(200).json({
      message: 'Your signature was deleted successfully.'
    });
  }
);


export {router as signatureRouter};
