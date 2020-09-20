const router = require('express').Router(); // eslint-disable-line new-cap
const User = require('../models/user.model');

// User & Password validation dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logging');
const validator = require('../utils/validation');

// Code responses
const GOOD_RESULT = 200;
const STANDARD_ERROR = 400;
const NO_RESULT_ERROR = 404;
const NRF_MESSAGE = 'No results found.';
const ERROR_MESSAGE = 'ERROR: ';
const CURR_ROUTER = '/users';

// Used for debugging
router.route('/').get((req, res) => {
  const endpoint = `GET ${CURR_ROUTER}/`;
  logger.logEndpoint(endpoint, '');

  User.find()
      .then((users) => res.status(GOOD_RESULT).json(users))
      .catch((err) => res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err));
});


// Used for debugging
router.route('/:id').get((req, res) => {
  const endpoint = `GET ${CURR_ROUTER}/${req.params.id}`;
  logger.logEndpoint(endpoint, 'START');

  User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          // No user found
          logger.logEndpoint(endpoint, 'COMPLETED: A');
          return res.status(NO_RESULT_ERROR).json(NRF_MESSAGE);
        } else {
          // Found user, returning info
          logger.logEndpoint(endpoint, 'COMPLETED: B');
          return res.status(GOOD_RESULT).json(user);
        }
      })
      .catch((err) => {
        logger.logEndpoint(endpoint, 'FAILED: A');
        return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
      });
});


/**
 * POST users/get/profile
 *
 * Returns the current logged in user's profile information
 *
 * INPUTS:
 * - token = req.body.token
 */
router.route('/get/profile').post((req, res) => {
  endpoint = `POST ${CURR_ROUTER}/get/profile`;
  logger.logEndpoint(endpoint, 'START');

  // Token validation
  const {decoded, errors, isValid} = validator.validateToken(req.body);

  // Check validation
  if (!isValid) {
    logger.logEndpoint(endpoint, 'COMPLETED: A');
    return res.status(STANDARD_ERROR).json(errors);
  }

  const userid = decoded.id;
  // const firstname = decoded.firstname;

  User.findById(userid)
      .then((user) => {
        if (!user) {
          // No user found
          logger.logEndpoint(endpoint, 'COMPLETED: A');
          return res.status(NO_RESULT_ERROR).json(NRF_MESSAGE);
        } else {
          // Found user, returning info
          logger.logEndpoint(endpoint, 'COMPLETED: B');
          return res.status(GOOD_RESULT).json(user);
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
 * - username = req.body.username;
 * - password = req.body.password;
 * - firstname = req.body.firstname;
 * - email = req.body.email;
 */
router.route('/register').post((req, res) => {
  endpoint = `POST ${CURR_ROUTER}/register`;
  logger.logEndpoint(endpoint, 'START');

  // Form validation
  const {errors, isValid} = validator.validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    logger.logEndpoint(endpoint, 'COMPLETED: A');
    return res.status(STANDARD_ERROR).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const email = req.body.email;

  User.findOne({email: req.body.email}).then((user) => {
    if (user) {
      logger.logEndpoint(endpoint, 'COMPLETED: B');
      return res.status(STANDARD_ERROR).json({email: 'Email already exists'});
    } else {
      const newUser = new User({
        username,
        password,
        firstname,
        email,
      });

      // Salt passwords before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
              .then((user) => {
                const payload = {
                  id: user.id,
                  firstname: user.firstname,
                };

                // Sign token
                jwt.sign( payload, 'secret',
                    {
                      expiresIn: 31556926, // 1 year in seconds
                    },
                    (err, token) => {
                      logger.logEndpoint(endpoint, 'COMPLETED: C');
                      return res.status(GOOD_RESULT).json(
                          {success: true, token: token});
                    },
                );
              })
              .catch((err) => {
                logger.logEndpoint(endpoint, 'FAILED: A');
                return res.status(STANDARD_ERROR).json(ERROR_MESSAGE + err);
              });
        });
      });
    }
  });
});


/**
 * POST users/login
 *
 * Checks authentication of login request, and if valid, logs in the user
 * using their passed information.
 *
 * INPUTS:
 * - email = req.body.email;
 * - username = req.body.username;
 * - password = req.body.password;
 */
router.route('/login').post((req, res) => {
  endpoint = `POST ${CURR_ROUTER}/login`;
  logger.logEndpoint(endpoint, 'START');

  // Form validation
  const {errors, isValid} = validator.validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    logger.logEndpoint(endpoint, 'COMPLETED: A');
    return res.status(STANDARD_ERROR).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;
  // Find user by username
  User.findOne({username}).then((user) => {
    // Check if user exists
    if (!user) {
      logger.logEndpoint(endpoint, 'COMPLETED: B');
      return res.status(NO_RESULT_ERROR).json(
          {usernameNotFound: 'Username not found'});
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.firstname,
        };

        // Sign token
        jwt.sign( payload, 'secret',
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              logger.logEndpoint(endpoint, 'COMPLETED: C');
              return res.status(GOOD_RESULT).json(
                  {success: true, token: token});
            },
        );
      } else {
        logger.logEndpoint(endpoint, 'FAILED: A');
        return res.status(STANDARD_ERROR).json(
            {passwordIncorrect: 'Password incorrect'});
      }
    });
  });
});

module.exports = router;
