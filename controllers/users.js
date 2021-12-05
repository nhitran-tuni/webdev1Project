const User = require("../models/user");
const responseUtils = require('../utils/responseUtils');
/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response http response
 */
const getAllUsers = async response => {
  // TODO: 10.1 Implement this
  return responseUtils.sendJson(response, await User.find(), 200);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} userId user id
 * @param {object} currentUser (mongoose document object)
 */
const deleteUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this
  const deletedUser = await User.findById(userId).exec();
  if ( !deletedUser ) {
    return responseUtils.notFound(response);
  }

  if ( userId === currentUser.id ){
    return responseUtils.badRequest(response, 'Bad request');
  }

  await User.deleteOne({ _id: userId}).then(function(){
    return responseUtils.sendJson(response, deletedUser, 200);
  });
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} userId user id
 * @param {object} currentUser (mongoose document object)
 * @param {object} userData JSON data from request body
 */
const updateUser = async (response, userId, currentUser, userData) => {
  // TODO: 10.1 Implement this
  const updatedUser = await User.findById(userId).exec();
  if ( !updatedUser ) {
    return responseUtils.notFound(response);
  }
  if ( userId === currentUser.id ){
    return responseUtils.badRequest(response, 'Updating own data is not allowed');
  }
  if ( !userData.role ) {
    return responseUtils.badRequest(response, 'Missing role');
  }
  if ( userData.role !== 'customer' && userData.role !== 'admin' ) {
    return responseUtils.badRequest(response, 'Invalid role');
  }
  updatedUser.role = userData.role;
  await updatedUser.save();
  return responseUtils.sendJson(response, updatedUser, 200);
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} userId user id
 */
const viewUser = async (response, userId) => {
  // TODO: 10.1 Implement this
  const vUser = await User.findById(userId).exec();
  if ( !vUser ) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, vUser, 200);
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  // TODO: 10.1 Implement this
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if ( !re.test(String(userData.email).toLowerCase()) ) {
    return responseUtils.badRequest(response, 'Email is not valid');
  }

  if ( !userData.name || !userData.password || !userData.email ) {
    return responseUtils.badRequest(response, 'Error');
  }

  const allUsers = await User.find();
  const allEmails = allUsers.map(item => item.email);
  if( allEmails.includes(userData.email) ) {
    return responseUtils.badRequest(response, 'Email in use');
  }

  if ( userData.password.length < 10 ){
    return responseUtils.badRequest(response, 'Password is too short');
  }
  const newUser = new User({
    name : userData.name,
    email : userData.email,
    password : userData.password,
    role : 'customer'
  });
  await newUser.save();
  return responseUtils.createdResource(response, newUser);
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
