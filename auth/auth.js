const {getCredentials} = require('../utils/requestUtils');
const User = require('../models/user');

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request request headers
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.4 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  const credentials = getCredentials(request);
  if(credentials){
    const user = await User.findOne({ email: credentials[0] }).exec();
    if (user) {
      const checkPass = await user.checkPassword(credentials[1]);
      if ( checkPass ){
        return user;
      } 
      return null;
    }
    return null;
  }
  return null;
};

module.exports = { getCurrentUser };
