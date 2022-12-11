import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import NeighborhoodCollection from '../neighborhood/collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the first name in req.body is valid, that is, it matches the firstname regex
 */
 const isValidFirstName = (req: Request, res: Response, next: NextFunction) => {
  const firstNameRegex = /^\w+$/i;
  if (!firstNameRegex.test(req.body.firstName)) {
    res.status(400).json({
      error: 'Email must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if the lastname in req.body is valid, that is, it matches the lastname regex
 */
 const isValidLastName = (req: Request, res: Response, next: NextFunction) => {
  const lastNameRegex = /^\w+$/i;
  if (!lastNameRegex.test(req.body.lastName)) {
    res.status(400).json({
      error: 'Email must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};


/**
 * Checks if an email in req.body is valid, that is, it matches the email regex
 */
const isValidEmail = (req: Request, res: Response, next: NextFunction) => {
  const emailRegex = /^[\w+.\-]{0,25}@(\w+)(\.)(\w+)$/i;
  if (!emailRegex.test(req.body.email)) {
    res.status(400).json({
      error: 'Email must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with email and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body as {email: string; password: string};

  if (!email || !password) {
    res.status(400).json({error: `Missing ${email ? 'password' : 'email'} credentials for sign in.`});
    return;
  }

  const user = await UserCollection.findOneByEmailAndPassword(
    email, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Invalid user login credentials provided.'});
  }
};

/**
 * Checks if a neighborhood in req.body exists
 */
const isNeighborhoodExists = async (req: Request, res: Response, next: NextFunction) => {
  const neighborhood = await NeighborhoodCollection.findOne(req.body.neighborhood);
  if (neighborhood === null){
      res.status(400).json({
          error: "Neighborhood not found"
      });
      return;
  }
  next();
};

/**
 * Checks if the email in req.body is already in use
 */
const isEmailNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email !== undefined) { // If email is not being changed, skip this check
    const user = await UserCollection.findOneByEmail(req.body.email);

    // If the current session user wants to change their email to one which matches
    // the current one irrespective of the case, we should allow them to do so
    if (user && (user?._id.toString() !== req.session.userId)) {
      res.status(409).json({
        error: 'An account with this email already exists.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
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

  next();
};


const isPatchEmailNotAlreadyInUse =  async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email !== undefined) { // If email is not being changed, skip this check
    await isEmailNotAlreadyInUse(req, res, next);
  }
  next();
};

const isPatchValidPassword = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.password !== undefined){
    isValidPassword(req,res,next)
  }
  next();
};

const isValidPatchFirstName = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.firstName !== undefined){
    isValidFirstName(req, res, next)
  }

  next();
};

const isValidPatchLastName = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.lastName !== undefined){
    isValidLastName(req,res,next)
  }

  next();
};
export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isEmailNotAlreadyInUse,
  isAccountExists,
  isAuthorExists,
  isValidEmail,
  isValidPassword,
  isValidFirstName,
  isValidLastName,
  isNeighborhoodExists,
  isPatchEmailNotAlreadyInUse,
  isPatchValidPassword,
  isValidPatchFirstName,
  isValidPatchLastName,
};
