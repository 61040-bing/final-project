import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import RoundTableCollection from './collection';
import PetitionCollection from '../petition/collection';
import UserCollection from '../user/collection';
import NeighborhoodCollection from 'server/neighborhood/collection';
import moment from 'moment';

/**
 * Checks if a RoundTable with roundTableId is req.params exists
 */
const isRoundTableExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.roundTableId);
  const roundTable = validFormat ? await RoundTableCollection.findOne(req.params.roundTableId) : '';
  if (!roundTable) {
    res.status(404).json({
      error: `RoundTable with RoundTable ID ${req.params.roundTableId} does not exist.`
    });
    return;
  }
  next();
};

/**
 * Check if the user already signed the petition.
 */
const isAlreadyMaxRoundTables = async (req: Request, res: Response, next: NextFunction) => {
    const petition = await PetitionCollection.findOne(req.body.petitionId);
    const roundTablesOnPetition = await RoundTableCollection.findAllbyPetitionId(petition._id);
    
    if (roundTablesOnPetition.length === 3){
      res.status(400).json({
        error: 'user is not allowed to add more than 3 roundTables to a petition'
    })
      return;
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
 * Checks if the current user is the author of the roundtable whose petitionId is in req.params
 */
const isValidRoundTableModifier = async (req: Request, res: Response, next: NextFunction) => {
  const roundTable = await RoundTableCollection.findOne(req.params.petitionId)
  const userId = roundTable.authorId;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' roundtables that you did not create.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user can create a roundtable whose petitionId is in req.body
 */
 const isValidRoundTableCreator = async (req: Request, res: Response, next: NextFunction) => {
  const petition = await PetitionCollection.findOne(req.body.petitionId)
  const userId = petition.authorId;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot create a roundtable for a petition that you did not create.'
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

/**
 * Checks if a Neighborhood with neighborhoodId as Neighborhood id in req.query exists
 */
 const isNeighborhoodExists = async (req: Request, res: Response, next: NextFunction) => {
  
  if (req.query.author !== undefined){
    next();
    return;
  }
  else{
    if (!req.query.neighborhood) {
      res.status(400).json({
        error: 'Provided neighborhood must be nonempty.'
      });
      return;
    }

    const  neighborhood= await NeighborhoodCollection.findOne(req.query.neighborhood as string);
    if (!neighborhood) {
      res.status(404).json({
        error: `A neighborhood with Id ${req.query.neighborhood as string} does not exist.`
      });
      return;
    }
  }

  next();
};

/**
* Checks if the expiration date of the freet in req.query is valid
* i.e. year >= new Date().year, 1<=month<=12, 1<=day <=31
*/
const isValidStartEndDates = async (req: Request, res: Response, next: NextFunction) => {

  
  if (!req.body.startDate){
   res.status(400).json({
     error: "Start date cannot be empty"
   });
   return; 
  }

  if (!req.body.endDate){
    res.status(400).json({
      error: "End date cannot be empty"
    });
    return; 
  }

  if (!moment(req.body.startDate).isValid()){
    res.status(400).json({
        error: 'Invalid start date.'
    });
    return;
  }

  if (!moment(req.body.endDate).isValid()){
    res.status(400).json({
        error: 'Invalid end date.'
    });
    return;
  }

  if (new Date(req.body.startDate) < new Date()){
    res.status(400).json({
        error: "Cannot set start date in past"
    });
  return;
  }
  if (new Date(req.body.endDate) < new Date()){
    res.status(400).json({
        error: "Cannot set end date in past"
    });
  return;
  }
  if (new Date(req.body.endDate) < new Date(req.body.startDate)){
    res.status(400).json({
        error: "end date cannot be before start date"
    });
  
    return;
  }
  next();
};

export {
  isValidPetitionId,
  isRoundTableExists,
  isValidRoundTableModifier,
  isAlreadyMaxRoundTables,
  isAuthorExists,
  isNeighborhoodExists,
  isValidStartEndDates,
  isValidRoundTableCreator
};