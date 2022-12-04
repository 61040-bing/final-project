import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import SignatureCollection from './collection';
import PetitionCollection from '../petition/collection';
import UserCollection from '../user/collection';
import NeighborhoodCollection from '../neighborhood/collection';

/**
 * Checks if a signature with signatureId is req.params exists
 */
const isSignatureExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.signatureId);
  const signature = validFormat ? await SignatureCollection.findOne(req.params.signatureId) : '';
  if (!signature) {
    res.status(404).json({
      error: `Signature with Signature ID ${req.params.signatureId} does not exist.`
    });
    return;
  }
  next();
};

/**
 * Check if the user already signed the petition.
 */
const isUserAlreadySigning = async (req: Request, res: Response, next: NextFunction) => {
    const petition = await PetitionCollection.findOne(req.params.petitionId);
    const signaturesOnPetition = await SignatureCollection.findAllbyPetitionId(petition._id);
    for (const signature of signaturesOnPetition){
      if (signature.authorId._id.toString() === req.session.userId){
        res.status(400).json({
          error: 'user is not allowed to sign a Petition more than once'
      })
        return;
      };
    };
    next();
}


/**
 * Checks if the petitionId in req.body is valid.
 */
const isValidPetitionId = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.petitionId);
  const petition = validFormat ? await PetitionCollection.findOne(req.body.petitionId) : '';
  if (!petition) {
    res.status(404).json({
      error: `Petition with petition ID ${req.body.petitionId} does not exist.`
    });
    return;
  };
  next();
};

/**
 * Checks if the current user is the author of the signature whose petitionId is in req.params
 */
const isValidSignatureModifier = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.petitionId);;
  
  const signature = await SignatureCollection.findOneByPetitionId(req.params.petitionId, req.session.userId)
  const userId = signature.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' signatures.'
    });
    return;
  }

  next();
};
/**
 * Checks if a user with userId as author id in req.query exists
 */
 const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  
  if (req.query.Petition !== undefined){
    next();
    return;
  }
  else{
    if (!req.query.author) {
      res.status(400).json({
        error: 'Provided author email must be nonempty.'
      });
      return;
    }

    const user = await UserCollection.findOneByEmail(req.query.author as string);
    if (!user) {
      res.status(404).json({
        error: `A user with email ${req.query.author as string} does not exist.`
      });
      return;
    }
  }

  next();
};
const isPetitionInUserNeighborhood = async (req: Request, res: Response, next: NextFunction) => {
  const petition = await PetitionCollection.findOne(req.params.petitionId)
  const petitionNeighborhood = await NeighborhoodCollection.findOne(petition.neighborhoodId)
  const user = await UserCollection.findOneByUserId(req.session.userId)
  const userNeighborhood = user.neighborhood._id
  if ((userNeighborhood.toString() !== petition.neighborhoodId._id.toString() )||
  petitionNeighborhood.name !== "city") {
    res.status(403).json({
      error: 'User Cannot sign a petition in a neighborhood that they are not part of.'
    });
    return;
  }

  next();
};
export {
  isValidPetitionId,
  isSignatureExists,
  isValidSignatureModifier,
  isUserAlreadySigning,
  isAuthorExists,
  isPetitionInUserNeighborhood
};
