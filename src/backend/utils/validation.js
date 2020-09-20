/** 
 * Functions related to user authentication
*/

const Validator = require("validator");
const isEmpty = require("is-empty");
const jwt = require("jsonwebtoken");

/**
 * Validates login information by checking for a username and password.
 * @param {*} data 
 */
function validateLoginInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    
    // Email checks
    if (Validator.isEmpty(data.username)) {
      errors.username = "Username field is required";
    }
    
    // Password checks
    if (Validator.isEmpty(data.password)) {
      errors.password = "Password field is required";
    }
    
    return {
      errors,
      isValid: isEmpty(errors)
    };
};

/**
 * Validates registration information by checking for a each of the required fields,
 * including a valid email.
 * @param {*} data 
 */
function validateRegisterInput(data) {
    let errors = {};
    
    // Convert empty fields to an empty string so we can use validator functions
    data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    
    // Name checks
    if (Validator.isEmpty(data.firstname)) {
        errors.name = "Name field is required";
    }
    
    if (Validator.isEmpty(data.username)) {
        errors.username = "User Name field is required";
    }
    
    
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

/**
 * Validates token passed by frontend, used for storing session information.
 * @param {*} data 
 */
function validateToken(data) {
    let errors = {};
    const token = data.token

    try {
        const decoded = jwt.verify(token, 'secret');
        return {
            decoded,
            errors,
            isValid: isEmpty(errors)
            };
    } catch (e) {
        errors.decoded = "Invalid Token";
        return {
            errors,
            errors,
            isValid: isEmpty(errors)
            };
    }
};

module.exports = {
    validateLoginInput: validateLoginInput,
    validateRegisterInput: validateRegisterInput,
    validateToken: validateToken
};
