const Product = require("../models/product");
const responseUtils = require('../utils/responseUtils');
/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response http response
 */
const getAllProducts = async response => {
  // TODO: 10.1 Implement this
  //const products = require('../products.json').map(item => ({...item}));
  const products = await Product.find({});
  return responseUtils.sendJson(response, products, 200);
};

/**
 * Update product and send updated product as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} productId product id
 * @param {object} productData JSON data from request body
 * @param {object} currentUser (mongoose document object)
 */
const updateProduct = async (response, productId, productData, currentUser) => {
  // TODO: 10.5 Implement this
  const updatedProduct = await Product.findById(productId).exec();
  if ( currentUser.role === "customer" ){
    return responseUtils.forbidden(response);
  }
  if ( !updatedProduct ) {
    return responseUtils.notFound(response);
  }
  if ( !productData.price ) {
    return responseUtils.badRequest(response, 'Missing price');
  }
  if ( productData.price <0 || typeof productData.price !== 'number') {
    return responseUtils.badRequest(response, 'Invalid price');
  }
  if (!productData.name) {
    return responseUtils.badRequest(response, 'Missing name');
  }
  updatedProduct.price = productData.price?productData.price:updatedProduct.price;
  updatedProduct.name = productData.name? productData.name:updatedProduct.name;
  updatedProduct.description = productData.description?productData.description:updatedProduct.description;
  updatedProduct.image = productData.image? productData.image:updatedProduct.image;
  await updatedProduct.save();
  return responseUtils.sendJson(response, updatedProduct, 200);
};

/**
 * Delete product and send deleted product as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} productId product id
 * @param {object} currentUser (mongoose document object)
 */
const deleteProduct = async (response, productId, currentUser) => {
  // TODO: 10.5 Implement this
  const deletedProduct = await Product.findById(productId).exec();
  if ( currentUser.role === "customer" ){
    return responseUtils.forbidden(response);
  }
  if ( !deletedProduct ) {
    return responseUtils.notFound(response);
  }

  await Product.deleteOne({ _id: productId}).then(function(){
    return responseUtils.sendJson(response, deletedProduct, 200);
  });
};

/**
 * Send product data as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {string} productId product id
 */
const viewProduct = async (response, productId) => {
  // TODO: 10.1 Implement this
  const vproduct = await Product.findById(productId).exec();
  if ( !vproduct ) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, vproduct, 200);
};

/**
 * Register new product and send created product back as JSON
 *
 * @param {http.ServerResponse} response http response
 * @param {object} productData JSON data from request body
 * @param {object} currentUser (mongoose document object)
 */
const registerProduct = async (response, productData, currentUser) => {
  // TODO: 10.5 Implement this

  if ( !currentUser ){
    return responseUtils.basicAuthChallenge(response);
  }

  if ( currentUser.role !== "admin" ){
    return responseUtils.forbidden(response);
  }
  
  if ( !productData.price ) {
    return responseUtils.badRequest(response, 'Missing price');
  }
  if ( productData.price <0 || typeof productData.price !== 'number') {
    return responseUtils.badRequest(response, 'Invalid price');
  }
  if (!productData.name) {
    return responseUtils.badRequest(response, 'Missing name');
  }
  const newProduct = new Product({
    name : productData.name,
    description : productData.description,
    price : productData.price,
    image : productData.image
  });
  await newProduct.save();
  return responseUtils.createdResource(response, newProduct);
};

module.exports = { getAllProducts, updateProduct, deleteProduct, registerProduct, viewProduct };
