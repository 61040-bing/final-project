// TODO
import type {HydratedDocument, Types} from 'mongoose';
import type {Neighborhood} from './model';
import NeighborhoodModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Neighborhood> is the output of the NeighborhoodModel() constructor,
 * and contains all the information in Neighborhood. https://mongoosejs.com/docs/typescript.html
 */
class NeighborhoodCollection {
    /**
     * Add a Neighborhood to the collection
     *
     * @return {Promise<HydratedDocument<Neighborhood>>} - The newly created Neighborhood
     * @param name
     * @param description
     */
    static async addOne(name: string, description: string): Promise<HydratedDocument<Neighborhood>> {
        const dateCreated = new Date();
        const neighborhood = new NeighborhoodModel({
            name,
            description,
            dateCreated,
        });
        await neighborhood.save();
        return neighborhood;
    }


    /**
     * Get all the neighborhoods in the database
     *
     * @return {Promise<HydratedDocument<Neighborhood>[]>} - An array of all of the freets
     */
    static async findAll(): Promise<Array<HydratedDocument<Neighborhood>>> {
        return NeighborhoodModel.find({});
    }


    /**
     * Update a neighborhood with the new description
     *
     * @return {Promise<HydratedDocument<Neighborhood>>} - The newly updated neighborhood
     * @param neighborhoodId
     * @param description
     */
    static async updateDescription(neighborhoodId: Types.ObjectId | string, description: string): Promise<HydratedDocument<Neighborhood>> {
        const neighborhood = await NeighborhoodModel.findOne({_id: neighborhoodId});
        neighborhood.description = description;
        await neighborhood.save();
        return neighborhood;
    }


    /**
     * Update a neighborhood with the new name
     *
     * @return {Promise<HydratedDocument<Neighborhood>>} - The newly updated neighborhood
     * @param neighborhoodId
     * @param description
     */
    static async updateName(neighborhoodId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Neighborhood>> {
        const neighborhood = await NeighborhoodModel.findOne({_id: neighborhoodId});
        neighborhood.name = name;
        await neighborhood.save();
        return neighborhood;
    }

    /**
     * Find neighborhood by name
     *
     * @return {Promise<HydratedDocument<Neighborhood>> | Promise<null> } - The neighborhood with the given name, if any
     * @param name
     */
    static async findNeighborhoodWithName(name: string): Promise<HydratedDocument<Neighborhood>> {
        return NeighborhoodModel.findOne({name});
    }



    /**
     * Delete a neighborhood with given neighborhoodId.
     *
     * @return {Promise<Boolean>} - true if the neighborhood has been deleted, false otherwise
     * @param neighborhoodId
     */
    static async deleteOne(neighborhoodId: Types.ObjectId | string): Promise<boolean> {
        const neighborhood = await NeighborhoodModel.deleteOne({_id: neighborhoodId});
        return neighborhood !== null;
    }

    /**
     * Find a neighborhood by neighborhoodId
     *
     * @param {string} neighborhoodId - The id of the neighborhood to find
     * @return {Promise<HydratedDocument<Neighborhood>> | Promise<null> } - The neighborhood with the given neighborhoodId, if any
     */
    static async findOne(neighborhoodId: Types.ObjectId | string): Promise<HydratedDocument<Neighborhood>> {
        return NeighborhoodModel.findOne({_id: neighborhoodId});
    }

}

export default NeighborhoodCollection;
