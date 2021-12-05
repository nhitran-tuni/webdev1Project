const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  // TODO: 10.5 Implement this
  name : {
    type : String, 
    minlength : 1, 
    maxlength : 50,
    required : true,
    trim : true
  },
  description : {
    type : String, 
    minlength : 10, 
    maxlength : 150,
    required : true,
    trim : true
  },
  price : {
    type : Number,
    required : true,
    description: "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point",
    validate : (val) => {return val > 0;}
  },
  image : {
    type : String,
    description: "Adding product images to the Web store API and pages is a Level 2 development grader substitute"
  },
});

// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;
