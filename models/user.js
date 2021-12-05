const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // TODO: 9.4 Implement this
  name : {
    type : String, 
    minlength : 1, 
    maxlength : 50,
    required : true,
    trim : true
  },
  email : {
    type : String,
    required : true,
    unique : true,
    match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password : {
    type : String,
    required : true,
    set : hashedPassword
  },
  role : {
    type : String,
    required : true,
    trim : true,
    lowercase : true,
    enum : ['admin', 'customer'],
    default : 'customer'
  }
});
function hashedPassword(password){
  const saltRounds = 10;
  if ( password.length < 10 ) return;
  return bcrypt.hashSync(password, saltRounds);
}
/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password input password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function (password) {
  // TODO: 9.4 Implement this
  return bcrypt.compare(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;
