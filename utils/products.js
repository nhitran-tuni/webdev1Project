/**
 * Week 09 utility file for user related operations
 *
 * NOTE: This file will be abandoned during week 09 when a database will be used
 * to store all data.
 */

/**
 * Use this object to store products
 *
 * An object is used so that products can be reset to known values in tests
 * a plain const could not be redefined after initialization but object
 * properties do not have that restriction.
 */
const data = {
    // make copies of products (prevents changing from outside this module/file)
    products: require('../products.json').map(product => ({ ...product }))
  };

  /**
   * Return all products
   *
   * Returns copies of the products and not the originals
   * to prevent modifying them outside of this module.
   *
   * @returns {Array<object>} all products
   */
  const getAllProducts = () => {
    // TODO: 9.1 Retrieve all products
    const products = data.products;
    return JSON.parse(JSON.stringify(products));
  };

  /**
 * Return product object with the matching ID or undefined if not found.
 *
 * Returns a copy of the product and not the original
 * to prevent modifying the product outside of this module.
 *
 * @param {string} productId product id
 * @returns {object} product
 */
const getProductById = productId => {
    // TODO: 9.1 Find product by product id
    const product = data.products.find(item =>
                                item._id === productId);
    if ( product ) {
      return {...product};
    }
    return undefined;
  };
  
  module.exports = {
    getAllProducts,
    getProductById
  };
  