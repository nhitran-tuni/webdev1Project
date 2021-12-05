const chai = require('chai');
const expect = chai.expect;
const { handleRequest } = require('../../routes');
const { createResponse } = require('node-mocks-http');

const Order = require('../../models/order');
const User = require('../../models/user');
const Product = require('../../models/product');

const {
    registerUser
  } = require('../../controllers/users');

const {
getAllOrders
} = require('../../controllers/order');

// Get products (create copies for test isolation)
const products = require('../../setup/products.json').map(product => ({ ...product }));

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };
// Set variables
const ordersUrl = '/api/orders';
const contentType = 'application/json';

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);

describe('Order Controller', () => {
    // 10.5
    let response;

    beforeEach(async () => {

        // reset database
        await User.deleteMany({});
        await User.create(users);
        allUsers = await User.find({});

        await Product.deleteMany({});
        await Product.create(products);
        allProducts = await Product.find({});
        const orders = allUsers.map(user => {
            return {
              customerId: user.id,
              items: [
                {
                  product: {
                    _id: allProducts[0].id,
                    name: allProducts[0].name,
                    price: allProducts[0].price,
                    description: allProducts[0].description
                  },
                  quantity: Math.floor(Math.random() * 5) + 1
                }
              ]
            };
          });
      
        await Order.deleteMany({});
        await Order.create(orders);
        response = createResponse();
        createnewResponse = createResponse();
    });

    describe('getAllOrders()', () => {
        it('should respond with status code 404 when order does not exist', async () => {
            // 11.3.5
            const testEmail = `test${adminUser.password}@email.com`;
            const userData = { ...adminUser, email: testEmail };
            await registerUser(createnewResponse, userData);
            const createdUser = await User.findOne({ email: testEmail }).exec();
            await getAllOrders(response,createdUser);
            expect(response.statusCode).to.equal(400);
            
        });
    });
});

describe('handleRequest()', () => {
    let url;
    beforeEach(async () => {
        customer = await User.findOne({ email: customerUser.email }).exec();
        order = await Order.findOne().sort({ _id: 1 }).limit(1).exec();
        allOrders = await Order.find({});
        url = `${ordersUrl}/${order.id}`;
        unknownId = order.id
          .split('')
          .reverse()
          .join('');
    });
    describe('Deleting order: DELETE /api/order/{id}', () => {            
        
        it('should delete order with admin credential', async () => {
            // 11.3.5
            const response = await chai
            .request(handleRequest)
            .delete(url)
            .set('Accept', contentType)
            .set('Authorization', `Basic ${adminCredentials}`);

            const dbOrders = await Order.find({});
            expect(response).to.have.status(200);
            expect(dbOrders).to.be.lengthOf(allOrders.length - 1);
        });

        it('should respond with "403 Forbidden" when customer credential', async () => {
            // 11.3.5
            const response = await chai
              .request(handleRequest)
              .delete(url)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${customerCredentials}`);
    
            expect(response).to.have.status(403);
        });

        it('should respond with status code 404 when order does not exist', async () => {
            const response = await chai
              .request(handleRequest)
              .delete(`${ordersUrl}/${unknownId}`)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${adminCredentials}`);
    
            expect(response).to.have.status(404);
          });
    });
});
  
