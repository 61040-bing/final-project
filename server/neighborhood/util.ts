import type {HydratedDocument} from 'mongoose';
import type {Neighborhood, PopulatedNeighborhood} from './model';
import {Types} from "mongoose";

type NeighborhoodResponse = {
    _id: string;
    name: string;
    description: string;
};


const constructNeighborhoodResponse = (neighborhood: HydratedDocument<Neighborhood>): NeighborhoodResponse => {
    const neighborhoodCopy: PopulatedNeighborhood = {
        ...neighborhood.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };

    return {
        ...neighborhoodCopy,
        _id: neighborhoodCopy._id.toString(),
    };
};

export {
    constructNeighborhoodResponse
};