/**
 * Asynchronously fetch JSON from the given url. (GET)
 *
 * Uses fetch to get JSON from the backend and returns the parsed
 * JSON back.
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await getJSON("/api/users");
 *
 *   -- OR --
 *
 *   getJSON("/api/users").then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const getJSON = async url => {
  // TODO: 8.3 Implement this
  return new Promise(resolve => {    
    fetch(url)
    .then(response => response.json())
    .then(data => resolve(data));
  });
};

/**
 * Asynchronously update existing content or create new content on the server (PUT or POST)
 *
 * Uses fetch to send data as JSON to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @param {string} method "PUT" or "POST"
 * @param {object|Array} data payload data be sent to the server as JSON
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const postOrPutJSON = async (url, method, data = {}) => {
  method = method.toUpperCase();
  if (method !== 'POST' && method !== 'PUT') {
    throw 'Invalid method! Valid methods are POST and PUT!';
  }

  // TODO: 8.3 Implement this
  return new Promise(resolve => {    
    fetch(url,{
      method: method, // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(item => resolve(item));
  });
};

/**
 * Asynchronously remove a resource from the server (DELETE)
 *
 * Uses fetch to send the request to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const deleteResourse = async url => {
  // TODO: 8.5 Implement this
  return fetch(url, {method: "DELETE"}).then(response => response.json()); 
};

/**
 * Generate random unique id to use as id value on notifications
 * or other HTML elements (remember that IDs must be unique within
 * a document).
 *
 * @returns {string} random id generation
 */
const generateId = () => {
  // Shamelessly borrowed from a Gist. See:
  // https://gist.github.com/gordonbrander/2230317
  return ('_' + Math.random().toString(36).substr(2, 9));
};

/**
 * Create a notification message that disappears after five seconds.
 *
 * Appends a new paragraph inside the container element and gives it
 * class based on the status of the message (success or failure).
 *
 * @param {string} message message to show in container
 * @param {string} containerId id attribute of the container element
 * @param {boolean} isSuccess whether the message describes a success or a failure
 */
const createNotification = (message, containerId, isSuccess = true) => {
  const container = document.getElementById(containerId);

  // Create new p element to hold text
  const newParagraph = document.createElement('p');

  // Create unique id for the notification so that it can easily be removed after timeout
  const notificationId = generateId();
  newParagraph.id = notificationId;

  // Set CSS class for the paragraph based on the isSuccess variable
  newParagraph.classList.add(isSuccess ? 'background-lightgreen' : 'background-red');

  // Add message test inside the paragraph and append the paragraph to the container
  newParagraph.append(document.createTextNode(message));
  container.append(newParagraph);

  // After five seconds remove the notification
  setTimeout(() => {
    removeElement(containerId, notificationId);
  }, 5000);
};

/**
 * Add product to cart
 *
 * @param {string} id resource id on the server
 */
const addToCart = async (id) => {
  // TODO: 9.1 Implement this
  if(localStorage.getItem(id)){
    const prodCount = parseInt(localStorage.getItem(id))+1;
    localStorage.setItem(id, prodCount);
  }
  else {
      localStorage.setItem(id, 1);
  }
};


/**
 * Decrease product from cart
 *
 * @param {string} id resource id on the server
 */
const decreasefromCart = async (id) => {
  // TODO: 9.1 Implement this
  const prodCount = parseInt(localStorage.getItem(id));
  if(prodCount>1){
    localStorage.setItem(id, prodCount-1);
  }
  else {
      localStorage.removeItem(id);
  }
};

/**
 * Clear product from cart
 *
 * @param {string} id resource id on the server
 */
const clearCart = async (id) => {
  // TODO: 9.1 Implement this
  localStorage.clear();
};


/**
 * Remove an element (and its descendants) from the DOM.
 *
 * @param {string} containerId containing element's id
 * @param {string} elementId id of the element to be removed
 */
const removeElement = (containerId, elementId) => {
  const container = document.getElementById(containerId);
  container.querySelectorAll(`#${elementId}`).forEach(element => element.remove());
};

/**
 * Constructor function for place a new order
 * 
 * @param {JSON} allProduct contain information of all available products
 * @param {string} id id of products in cart
 */
function Item(allProduct, id) {
  this.product = allProduct.find(x => x._id === id);
  this.quantity = parseInt(localStorage.getItem(id));
}

/**
 * Place a new order
 * 
 */
const placeNewOrder = async () => {
  const arrayKeys = Object.keys(localStorage);
  const allProduct = await getJSON("api/products");
  const orderItems = arrayKeys.map(id => new Item(allProduct, id));
  if (orderItems.length >= 1){
    const newOrder = {items : orderItems};
    postOrPutJSON("/api/orders", "POST", newOrder);
  }
}
