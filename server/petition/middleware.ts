import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PetitionCollection from './collection';
import NeighborhoodCollection from '../neighborhood/collection';

/**
 * Checks if a petition with petitionId is req.params exists
 */
const isPetitionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.petitionId);
  const petition = validFormat ? await PetitionCollection.findOne(req.params.petitionId) : '';
  if (!petition) {
    res.status(404).json({
      error: `Petition with petition ID ${req.params.petitionId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * checks if neighborhoodId in req.query.neighborhood exists
 */
const isNeighborhoodExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.neighborhood) {
    res.status(400).json({
      error: 'Provided neighborhoodId must be nonempty.'
    });
    return;
  }

  const neighborhood = await NeighborhoodCollection.findOne(req.query.neighborhood as string);
  if (!neighborhood) {
    res.status(404).json({
      error: `A neighborhood with neighborhoodId ${req.query.neighborhood as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a petition with petitionId is req.query exists
 */
const isPetitionQueryExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.petition) {
    res.status(400).json({
      error: 'Provided petitionId must be nonempty.'
    });
    return;
  }

  const petition = await PetitionCollection.findOne(req.query.petition as string);
  if (!petition) {
    res.status(404).json({
      error: `A petition with petitionid ${req.query.petition as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the title of the petition in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidPetitionTitle = (req: Request, res: Response, next: NextFunction) => {
  const {title} = req.body.title as {title: string};
  if (!title.trim()) {
    res.status(400).json({
      error: 'Petition content must be at least one character long.'
    });
    return;
  }

  if (title.length > 140) {
    res.status(413).json({
      error: 'Petition title must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * checks if the target number of signatures in req.params.targetSignatures is valid
 */
const isValidPetitionTargetSignatures = (req: Request, res: Response, next: NextFunction) => {
  const {targetSignatures} = req.body.targetSignatures as {targetSignatures: string};
  if (!targetSignatures.trim()) {
    res.status(400).json({
      error: 'targetSignatures must be at least one character long.'
    });
    return;
  }

  if (parseInt(targetSignatures) <= 0) {
    res.status(413).json({
      error: 'Petition target signatures must be at least greater than zero.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the petition whose petitionId is in req.params
 */
const isValidPetitionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const petition = await PetitionCollection.findOne(req.params.petitionId);
  const userId = petition.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' petitions.'
    });
    return;
  }

  next();
};

export {
  isValidPetitionTitle,
  isPetitionExists,
  isValidPetitionModifier,
  isPetitionQueryExists,
  isValidPetitionTargetSignatures,
  isNeighborhoodExists
};
