const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');
const responseUser = require('./controllers/users');
const responseProduct = require('./controllers/products');
const responseOrder = require('./controllers/order');
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['POST', 'GET'],
  '/api/orders' : ['GET', 'POST'],
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response http response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix prefix for url
 * @returns {boolean} match route pattern and return boolean value
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} match url pattern and return boolean value
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

/**
 * Does the URL match /api/products/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} match url pattern and return boolean value
 */
const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

/**
 * Does the URL match /api/orders/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} match url pattern and return boolean value
 */
const matchOrderId = url => {
  return matchIdRoute(url, 'orders');
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const requestHeader = request.headers['authorization'];
    const userId = url.split("/")[3];
    if (requestHeader){
      const currentUser = await getCurrentUser(request);
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      if ( !currentUser ){
        return responseUtils.basicAuthChallenge(response);
      }

      if (currentUser && currentUser.role === "customer"){
        return responseUtils.forbidden(response);
      } 

      if (method.toUpperCase() === 'GET' && currentUser.role === "admin"){
        return responseUser.viewUser(response, userId);         
      }

      if (method.toUpperCase() === 'DELETE' && currentUser.role === "admin"){
        return responseUser.deleteUser(response, userId, currentUser);
      }

      if (method.toUpperCase() === 'PUT' && currentUser.role === "admin"){
        const userData =  await parseBodyJson(request);
        return responseUser.updateUser(response, userId, currentUser, userData);
      }   
    } 
    return responseUtils.basicAuthChallenge(response);
  }

  if (matchProductId(filePath)) {
    // TODO: 10.5 Implement view, update and delete a single product by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const requestHeader = request.headers['authorization'];
    const productId = url.split("/")[3];

    if (requestHeader){
      const currentUser = await getCurrentUser(request);
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      if ( !currentUser ){
        return responseUtils.basicAuthChallenge(response);
      }

      if (method.toUpperCase() === 'GET'){
        return responseProduct.viewProduct(response, productId);     
      }

      if (method.toUpperCase() === 'DELETE'){
        return responseProduct.deleteProduct(response, productId, currentUser);
      }

      if (method.toUpperCase() === 'PUT'){
        const productData =  await parseBodyJson(request);
        return responseProduct.updateProduct(response, productId, productData, currentUser);
      }
    } 
    return responseUtils.basicAuthChallenge(response);
  }

  if (matchOrderId(filePath)) {
    // TODO: Implement view and delete a single order by ID (GET, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const requestHeader = request.headers['authorization'];
    const orderId = url.split("/")[3];

    if ( requestHeader ){
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      const currentUser = await getCurrentUser(request);

      if ( !currentUser ){
        return responseUtils.basicAuthChallenge(response);
      }
      
      if ( method.toUpperCase() === 'GET' ){
        return responseOrder.viewOrder(response, orderId, currentUser);
      }

      if ( method.toUpperCase() === 'DELETE' ){
        return responseOrder.deleteOrder(response, orderId, currentUser);
      }
    }
    return responseUtils.basicAuthChallenge(response);
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    // TODO: 8.3 Return all users as JSON
    // TODO: 8.4 Add authentication (only allowed to users with role "admin")
    const authrequestHeader = request.headers['authorization'];
    if(authrequestHeader){
      const currentUser = await getCurrentUser(request);
      if ( !currentUser ){
        return responseUtils.basicAuthChallenge(response);
      }
      if(currentUser && currentUser.role==="admin"){
        return responseUser.getAllUsers(response);
      }
      else {
        return responseUtils.forbidden(response);
      }
    }
    return responseUtils.basicAuthChallenge(response);
  }

  // GET all products
  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    // TODO: 9.1 Return all products as JSON
    // TODO: 9.1 Add authentication (only allowed to users with role "admin" and "customer")
    const productrequestHeader = request.headers['authorization'];
    if(productrequestHeader){
        const currentUser = await getCurrentUser(request);

        if ( !currentUser ){
          return responseUtils.basicAuthChallenge(response);
        }

        else if(currentUser.role==="admin" || currentUser.role==="customer"){
          return responseProduct.getAllProducts(response);
        }
    }
    return responseUtils.basicAuthChallenge(response);
  }

  // Get all orders
  if (filePath === '/api/orders' && method.toUpperCase() === 'GET'){
    // TODO: Return all product as JSON  
    // For admins return a collection of all orders in the system.  
    // For a customer return a collection of this user's OWN orders.
    const orderRequestHeader = request.headers['authorization'];
    // Fail if not a JSON request
    if ( orderRequestHeader ) {
      const currentUser = await getCurrentUser(request);
      if ( !currentUser ) {
        return responseUtils.basicAuthChallenge(response);
      }
      return responseOrder.getAllOrders(response, currentUser);
    }
    return responseUtils.basicAuthChallenge(response);
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.3 Implement registration
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const userData = await parseBodyJson(request);
    return responseUser.registerUser(response, userData);
  }

  // register new product
  // TODO: 10.5 Implement registration
  // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
    const productrequestHeader = request.headers['authorization'];
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    if (productrequestHeader){
      const currentUser = await getCurrentUser(request);
      const productData =  await parseBodyJson(request);
      return responseProduct.registerProduct(response, productData, currentUser);    
    } 
    return responseUtils.basicAuthChallenge(response);
  }

  // TODO: Implement place a new order
  if ( filePath === '/api/orders' && method.toUpperCase() === 'POST' ){
    const orderRequestHeader = request.headers['authorization'];
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    if ( orderRequestHeader ) {
      const currentUser = await getCurrentUser(request);
      if ( !currentUser ) {
        return responseUtils.basicAuthChallenge(response);
      }
      const orderData = await parseBodyJson(request);
      return responseOrder.placeOrder(response, currentUser, orderData);
    }
    return responseUtils.basicAuthChallenge(response);
  }
    
};

module.exports = { handleRequest };
