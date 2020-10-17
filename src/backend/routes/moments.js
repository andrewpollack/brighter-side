const router = require('express').Router(); // eslint-disable-line new-cap
const Moment = require('../models/moment.model');
const User = require('../models/user.model');

const logger = require('../utils/logging');
const validator = require('../utils/validation');

// Code responses
const GOOD_RESULT = 200;
const STANDARD_ERROR = 400;
const NO_RESULT_ERROR = 404;
const NRF_MESSAGE = 'No results found.';
const ERROR_MESSAGE = 'ERROR: ';
const CURR_ROUTER = '/moments';

// Used for debugging
router.route('/').get((req, res) => {
  const endpoint = `GET ${CURR_ROUTER}/`;
  logger.logEndpoint(endpoint, '');

  Moment.find()
      .then((moments) => res.status(GOOD_RESULT).json(moments))
      .catch((err) => res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err));
});


// Used for debugging
router.route('/:id').get((req, res) => {
  const endpoint = `GET ${CURR_ROUTER}/${req.params.id}`;
  logger.logEndpoint(endpoint, 'START');

  Moment.findById(req.params.id)
      .then((moment) => {
        if (!moment) {
          // No user found
          logger.logEndpoint(endpoint, 'COMPLETED: A');
          return res.status(NO_RESULT_ERROR).json(NRF_MESSAGE);
        } else {
          // Found moment, returning info
          logger.logEndpoint(endpoint, 'COMPLETED: B');
          return res.status(GOOD_RESULT).json(moment);
        }
      })
      .catch((err) => {
        logger.logEndpoint(endpoint, 'FAILED: A');
        return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
      });
});

/**
 * POST users/register
 *
 * Registers a new user from information specified in body.
 *
 * INPUTS:
 * - token = req.body.token
 * - textdescription = req.body.textdescription;
 * - date = req.body.date;
 */
router.route('/create').post((req, res) => {
  endpoint = `POST ${CURR_ROUTER}/create`;
  logger.logEndpoint(endpoint, 'START');

  // Token validation
  const {decoded, errors, isValid} = validator.validateToken(req.body);

  // Check validation
  if (!isValid) {
    logger.logEndpoint(endpoint, 'COMPLETED: A');
    return res.status(STANDARD_ERROR).json(errors);
  }

  const ownerId = decoded.id;
  const textDescription = req.body.textDescription;
  const dateObject = new Date();

  const newMoment = new Moment({
    ownerId,
    textDescription,
    date: dateObject,
  });


  User.findById(ownerId)
      .then((user) => {
        if (!user) {
          // No user found, don't create moment
          logger.logEndpoint(endpoint, 'COMPLETED: A');
          return res.status(NO_RESULT_ERROR).json(NRF_MESSAGE);
        } else {
          // Found user, saving new moment
          newMoment.save()
              .then((moment) => {
                momentId = moment._id;
                console.log(momentId);
                userUpdatedMoments = user.moments;
                userUpdatedMoments.push(momentId);

                // Updating user's info to have moment
                User.updateOne({_id: ownerId}, {moments: userUpdatedMoments} )
                    .then(() => {
                      logger.logEndpoint(endpoint, 'COMPLETED: B');
                      return res.status(GOOD_RESULT).json('Moment Created');
                    })
                    .catch((err) => {
                      logger.logEndpoint(endpoint, 'FAILED: A');
                      return res.status(STANDARD_ERROR)
                          .json(ERROR_MESSAGE + err);
                    });
              })
              .catch((err) => {
                logger.logEndpoint(endpoint, 'FAILED: A');
                return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
              });
        }
      })
      .catch((err) => {
        logger.logEndpoint(endpoint, 'FAILED: A');
        return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
      });
});


/**
 * POST users/register
 *
 * Registers a new user from information specified in body.
 *
 * INPUTS:
 * - token = req.body.token
 * - textdescription = req.body.textdescription;
 * - date = req.body.date;
 */
router.route('/delete').post((req, res) => {
  endpoint = `POST ${CURR_ROUTER}/delete`;
  logger.logEndpoint(endpoint, 'START');

  // Token validation
  const {decoded, errors, isValid} = validator.validateToken(req.body);

  // Check validation
  if (!isValid) {
    logger.logEndpoint(endpoint, 'COMPLETED: A');
    return res.status(STANDARD_ERROR).json(errors);
  }

  const ownerId = decoded.id;
  const momentId = req.body.momentId;

  User.findById(ownerId)
      .then((user) => {
        if (!user) {
          // No user found, don't delete moment
          logger.logEndpoint(endpoint, 'COMPLETED: A');
          return res.status(NO_RESULT_ERROR).json(NRF_MESSAGE);
        } else {
          // Found user, make sure they have this moment
          const usersMoments = user.moments;

          if (usersMoments.includes(momentId)) {
            newMoments = user.moments;
            const momentIndex = newMoments.indexOf(momentId);

            if (momentIndex > -1) {
              newMoments.splice(momentIndex, 1);
            }

            // Updating user's info to have moment
            User.updateOne({_id: ownerId}, {moments: newMoments} )
                .then(() => {
                  Moment.findByIdAndDelete(momentId)
                      .then(() => {
                        logger.logEndpoint(endpoint, 'COMPLETED: B');
                        return res.status(GOOD_RESULT).json('Moment Deleted');
                      })
                      .catch((err) => {
                        logger.logEndpoint(endpoint, 'FAILED: A');
                        return res.status(STANDARD_ERROR)
                            .json(ERROR_MESSAGE + err);
                      });
                })
                .catch((err) => {
                  logger.logEndpoint(endpoint, 'FAILED: A');
                  return res.status(STANDARD_ERROR)
                      .json(ERROR_MESSAGE + err);
                });
          } else {
            logger.logEndpoint('COMPLETED: E');
            return res.status(GOOD_RESULT).json('You don\'t have that moment');
          }
        }
      })
      .catch((err) => {
        logger.logEndpoint(endpoint, 'FAILED: A');
        return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
      });
});

/**
 * POST users/register
 *
 * Registers a new user from information specified in body.
 *
 * INPUTS:
 * - token = req.body.token
 * - textdescription = req.body.textdescription;
 * - date = req.body.date;
 *
router.route('/update').post((req, res) => {
  endpoint = `POST ${CURR_ROUTER}/create`;
  logger.logEndpoint(endpoint, 'START');

  // Token validation
  const {decoded, errors, isValid} = validator.validateToken(req.body);

  // Check validation
  if (!isValid) {
    logger.logEndpoint(endpoint, 'COMPLETED: A');
    return res.status(STANDARD_ERROR).json(errors);
  }

  const ownerId = decoded.id;
  const textDescription = req.body.textDescription;
  const dateObject = new Date();

  const newMoment = new Moment({
    ownerId,
    textDescription,
    date: dateObject,
  });


  User.findById(ownerId)
      .then((user) => {
        if (!user) {
          // No user found, don't create moment
          logger.logEndpoint(endpoint, 'COMPLETED: A');
          return res.status(NO_RESULT_ERROR).json(NRF_MESSAGE);
        } else {
          // Found user, saving new moment
          newMoment.save()
              .then((moment) => {
                momentId = moment._id;
                console.log(momentId);
                userUpdatedMoments = user.moments;
                userUpdatedMoments.push(momentId);

                // Updating user's info to have moment
                User.updateOne({_id: ownerId}, {moments: userUpdatedMoments} )
                    .then(() => {
                      logger.logEndpoint(endpoint, 'COMPLETED: B');
                      return res.status(GOOD_RESULT).json('Moment Created');
                    })
                    .catch((err) => {
                      logger.logEndpoint(endpoint, 'FAILED: A');
                      return res.status(STANDARD_ERROR)
                          .json(ERROR_MESSAGE + err);
                    });
              })
              .catch((err) => {
                logger.logEndpoint(endpoint, 'FAILED: A');
                return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
              });
        }
      })
      .catch((err) => {
        logger.logEndpoint(endpoint, 'FAILED: A');
        return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
      });
});*/

module.exports = router;
