import type {HydratedDocument, Types} from 'mongoose';
import type {Signature} from './model';
import SignatureModel from './model';
import UserCollection from '../user/collection';
import PetitionCollection from '../petition/collection';

/**
 * This files contains a class that has the functionality to explore Signatures
 * stored in MongoDB, including adding, finding, and deleting signatures.
 *
 */
class SignatureCollection {
  /**
   * Add a signature to the collection
   *
   * @param {string} authorId - The id of the author of the signature
   * @param {string} petition - The id of the petition
   * @return {Promise<HydratedDocument<Signature>>} - The newly created signature
   */
  static async addOne(authorId: Types.ObjectId | string, petitionId: Types.ObjectId | string): Promise<HydratedDocument<Signature>> {
    const date = new Date();
    const signature = new SignatureModel({
      authorId,
      petitionId,
      dateCreated: date,

    });
    await signature.save(); // Saves signature to MongoDB
    return signature.populate('authorId');
  }

  /**
   * 
   * Submit a petition if target number of signatures is achieved
   */
  static async submitPetitionIfTargetReached(petitionId: Types.ObjectId | string){
    const petition = await PetitionCollection.findOne(petitionId);
    const signatuesOnPetitition = await SignatureCollection.findAllbyPetitionId(petitionId);
    if (signatuesOnPetitition.length === petition.targetSignatures){
      petition.submitted = true;
    }
    await petition.save();
    return petition.submitted;
  }

  /**
   * Find a signature by signatureId
   *
   * @param {string} signatureId - The id of the signature to find
   * @return {Promise<HydratedDocument<Signature>> | Promise<null> } - The signature with the given signatureId, if any
   */
  static async findOne(signatureId: Types.ObjectId | string): Promise<HydratedDocument<Signature>> {
    return SignatureModel.findOne({_id: signatureId}).populate('authorId');

  }


/**
   * Find a signature by petitionId for a given author
   * @param {string} petitionId - The id of the petition
   * @param {string} authorId - The id of the author of the signature on petition to find
   * @return {Promise<HydratedDocument<Signature>> | Promise<null> } - The signature on the petition by author, if any
  */
 static async findOneByPetitionId(petitionId: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<Signature>> {
  const author = await UserCollection.findOneByUserId(authorId);
  const petition = await PetitionCollection.findOne(petitionId);
  return SignatureModel.findOne({petitionId: petition, authorId: author._id}).populate('authorId');


}



  /**
   * Get all the signatures in the database (i.e. on all Petitions by all users)
   *
   * @return {Promise<HydratedDocument<Signature>[]>} - An array of all of the signatures
   */
  static async findAll(): Promise<Array<HydratedDocument<Signature>>> {
    // Retrieves signatures and sorts them from most to least recent
    return SignatureModel.find({}).sort({dateCreated: -1}).populate('authorId');

  }

  /**
   * Get all the signaturess in by given author
   *
   * @param {string} email - The email of author of the signatures
   * @return {Promise<HydratedDocument<Signature>[]>} - An array of all of the signatures
   */
  static async findAllByEmail(email: string): Promise<Array<HydratedDocument<Signature>>> {
    const author = await UserCollection.findOneByEmail(email);
    return SignatureModel.find({authorId: author._id}).populate('authorId');

  }

  /**
   * Get all the signatures in by given author 
   *
   * @param {string} userId - The id of author of the signatures
   * @return {Promise<HydratedDocument<Signature>[]>} - An array of all of the signatures
   */
 static async findAllByUserId(userId: Types.ObjectId |string): Promise<Array<HydratedDocument<Signature>>> {
  const author = await UserCollection.findOneByUserId(userId);
  return SignatureModel.find({authorId: author._id}).populate('authorId');

}

  /**
   * Get all the Signatures on a Petition
   * 
   * @param {string} petitionId - The Id of the Petition
   * @returns Promise<Array<HydratedDocument<Petition>>> - An array of all the Petitions
   */
  static async findAllbyPetitionId(petitionId: Types.ObjectId | string): Promise<Array<HydratedDocument<Signature>>>{
    const petition = await PetitionCollection.findOne(petitionId);
    return SignatureModel.find({petitionId: petition._id}).populate('_id');
  }

  /**
   * Delete a signature with givensignatureId.
   *
   * @param {string} signatureId - The signatureId of signature to delete
   * @return {Promise<Boolean>} - true if the signature has been deleted, false otherwise
   */
  static async deleteOne(signatureId: Types.ObjectId | string): Promise<boolean> {
    const signature = await SignatureModel.deleteOne({_id: signatureId});
    return signature !== null;
  }

  /**
   * Delete a signature with given petitionId created by the authorId.
   *
   * @param {string} petitionId - The petitionId of whose signature to delete
   * @param {string} authorId - The author of the signature to delete
   * @return {Promise<Boolean>} - true if the signature has been deleted, false otherwise
   */
 static async deleteOnebyPetitionID(petitionId: Types.ObjectId | string, authorId:Types.ObjectId|string): Promise<boolean> {
  const signature = await SignatureModel.deleteOne({petitionId:petitionId, authorId:authorId});
  return signature !== null;
}


  /**
   * Delete all the signatures by the given author
   *
   * @param {string} authorId - The id of author of signatures
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await SignatureModel.deleteMany({authorId});
  }

  /**
   * Delete all the signatures on a petition
   * @param {string} petitionId - The id of the Petition whose signatures are being deleted
   */
  static async deleteManybyPetitionId(petitionId: Types.ObjectId | string ):Promise<void>{
    await SignatureModel.deleteMany({petitionId: petitionId})
  }

}



export default SignatureCollection;
