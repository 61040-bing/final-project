import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import NeighborhoodCollection from "./collection";



const isNeighborhoodExists = async (req: Request, res: Response, next: NextFunction) => {
    const neighborhood1 = await NeighborhoodCollection.findOne(req.params.neighborhoodId);
    const neighborhood2 = await NeighborhoodCollection.findOne(req.query.neighborhoodId as string);
    const neighborhood3 = await NeighborhoodCollection.findOne(req.body.neighborhoodId);
    if (neighborhood1 === null && neighborhood2 === null && neighborhood3 === null){
        res.status(400).json({
            error: "Neighborhood not found"
        });
        return;
    }
    next();
};

/**
 * Checks if the neighborhood name does not exist
 */
const isNeighborhoodNameNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const neighborhood = await NeighborhoodCollection.findNeighborhoodWithName(req.params.name);
    if (neighborhood !== null){
        res.status(400).json({
            error: "Neighborhood Name already exists"
        });
        return;
    }
    next();
};

export {
    isNeighborhoodExists,
    isNeighborhoodNameNotExists
};
