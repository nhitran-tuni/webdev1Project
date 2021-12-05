const chai = require('chai');
const expect = chai.expect;
const { handleRequest } = require('../../routes');

const Product = require('../../models/product');
const User = require('../../models/user');

const { createResponse } = require('node-mocks-http');
const {
  registerProduct,
  deleteProduct,
  updateProduct
} = require('../../controllers/products');

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };
// Get products
const products = require('../../setup/products.json').map(product => ({ ...product }));
// Set variables
const productsUrl = '/api/products';
const contentType = 'application/json';

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);
const invalidCredentials = encodeCredentials(adminUser.email, customerUser.password);

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
    let str = '';
  
    do {
      str += Math.random().toString(36).substr(2, 9).trim();
    } while (str.length < len);
  
    return str.substr(0, len);
  };

// get randomized test data
const getTestData = () => {
    return {
      name: generateRandomString(),
      description: generateRandomString(20),
      price: 3.0,
    };
  };

describe('Product Model', () => {
  describe('Schema validation', () => {
    it('must require "name"', () => {
        // 10.3
        // expect(() => {}).to.throw(); 
        // 10.5
        const data = getTestData();
        delete data.name;
        const product = new Product(data);
        const error = product.validateSync();
        expect(error).to.exist;
    });

    it('must not allow "name" to have only spaces', () => {
        // 10.3
        // expect(() => {}).to.throw(); 
        // 10.5
        const data = getTestData();
        data.name = '     ';
        const product = new Product(data);
        const error = product.validateSync();
        expect(error).to.exist;
    });

    it('must require "price"', () => {
        // 10.3
        // expect(() => {}).to.throw(); 
        // 10.5
        const data = getTestData();
        delete data.price;
        const product = new Product(data);
        const error = product.validateSync();
        expect(error).to.exist;
    });

    it('must not allow "price" to be 0 or less', () => {
        // 10.3
        // expect(() => {}).to.throw(); 
        // 10.5
        const data = getTestData();
        data.price = 0;
        const product = new Product(data);
        const error = product.validateSync();
        expect(error).to.exist; 
    });
  });
});
describe('Product Controller', () => {
    // 10.5
    let currentUser;
    let product;
    let response;

    beforeEach(async () => {
        // reset database
        await User.deleteMany({});
        await User.create(users);
        await Product.deleteMany({});
        await Product.create(products);

        // set variables
        currentUser = await User.findOne({ email: adminUser.email }).exec();
        customer = await User.findOne({ email: customerUser.email }).exec();
        product = await Product.findOne().sort({ _id: -1 }).limit(1).exec();
        response = createResponse();
    });
    describe('updateProduct()', () => {
        it('should update only the price of the product with productId', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const data = getTestData();
            const productId = product.id
            const expectedData = {
                _id: product.id,
                name: product.name,
                description: product.description,
                image : product.image,
                price: 5.0,
            };
            await updateProduct(response, productId, { name: product.name,price: 5.0 },currentUser);
            expect(response.statusCode).to.equal(200);
            expect(response.getHeader('content-type')).to.equal('application/json');
            expect(response._isJSON()).to.be.true;
            expect(response._isEndCalled()).to.be.true;
            expect(response._getJSONData()).to.include(expectedData); 
        });

        // added test to fulfill coverage 95%
        it('should return 400 bad request when name is missing', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const data = getTestData();
            const productId = product.id
            await updateProduct(response, productId, { price: 5.0 },currentUser);
            expect(response.statusCode).to.equal(400);
        });
    });

    describe('deleteProduct()', () => {

        it('should delete existing product with productId', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const productId = product.id;
            const productData = JSON.parse(JSON.stringify(product));
            await deleteProduct(response, productId, currentUser);

            const foundProduct = await Product.findById(productId).exec();
            expect(response.statusCode).to.equal(200);
            expect(response.getHeader('content-type')).to.equal('application/json');
            expect(response._isJSON()).to.be.true;
            expect(response._isEndCalled()).to.be.true;
            expect(foundProduct).to.be.null; 
        });

        it('should return the deleted product', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const productId = product.id;
            const productData = JSON.parse(JSON.stringify(product));
            await deleteProduct(response, productId,currentUser);

            expect(response.statusCode).to.equal(200);
            expect(response.getHeader('content-type')).to.equal('application/json');
            expect(response._isJSON()).to.be.true;
            expect(response._isEndCalled()).to.be.true;
            expect(response._getJSONData()).to.include(productData); 
        });
    });

    describe('registerProduct()', () => {
        it('should respond with "201 Created" when add is successful', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const data = getTestData();
            const productName = "TestRegisterProduct";
            const productData = {...data,name:productName};
            await registerProduct(response, productData,currentUser);
            const createdProduct = await Product.findOne({ name: productName });

            expect(response.statusCode).to.equal(201);
            expect(response.getHeader('content-type')).to.equal('application/json');
            expect(response._isJSON()).to.be.true;
            expect(response._isEndCalled()).to.be.true;
            expect(createdProduct).to.not.be.null;
            expect(createdProduct).to.not.be.undefined;
            expect(createdProduct).to.be.an('object'); 
        });

        it('should return the added product', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const data = getTestData();
            const productName = "TestRegisterProduct";
            const productData = {...data,name:productName};
            await registerProduct(response, productData,currentUser);
            const createdProduct = await Product.findOne({ name: productName });
            const expectedData = JSON.parse(JSON.stringify(createdProduct));
            expect(response.statusCode).to.equal(201);
            expect(response.getHeader('content-type')).to.equal('application/json');
            expect(response._isJSON()).to.be.true;
            expect(response._isEndCalled()).to.be.true;
            expect(createdProduct).to.not.be.null;
            expect(createdProduct).to.not.be.undefined;
            expect(createdProduct).to.be.an('object');
            expect(response._getJSONData()).to.include(expectedData); 
        });
    });
});

describe('handleRequest()', () => {
    let url;
    beforeEach(async () => {
        product = await Product.findOne().sort({ _id: 1 }).limit(1).exec();
        allProducts = await Product.find({});
        url = `${productsUrl}/${product.id}`;
    });
    describe('Updating products: PUT /api/products/{id}', () => {
        
        it('should update product when admin credentials are received', async () => {
            // 10.3
            //expect(() => {}).to.throw();
            // 10.5
            const response = await chai
            .request(handleRequest)
            .put(url)
            .set('Accept', contentType)
            .set('Authorization', `Basic ${adminCredentials}`)
            .send(product);

            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.all.keys('_id', 'name', 'description', 'price','image');
        });
        
        it('should respond with "403 Forbidden" when customer credentials are received', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const response = await chai
              .request(handleRequest)
              .put(url)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${customerCredentials}`)
              .send(product);
    
            expect(response).to.have.status(403);
          });
    });
    describe('Deleting product: DELETE /api/products/{id}', () => {            
        
        it('should delete product with admin credential', async () => {
            // 10.3
            //expect(() => {}).to.throw(); 
            // 10.5
            const response = await chai
            .request(handleRequest)
            .delete(url)
            .set('Accept', contentType)
            .set('Authorization', `Basic ${adminCredentials}`);

            const dbProducts = await Product.find({});
            expect(response).to.have.status(200);
            expect(dbProducts).to.be.lengthOf(allProducts.length - 1);
        });

        it('should respond with "403 Forbidden" when customer credential', async () => {
            // 10.3
            //expect(() => {}).to.throw(); 
            //10.5
            const response = await chai
              .request(handleRequest)
              .delete(url)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${customerCredentials}`);
    
            expect(response).to.have.status(403);
        });
    });
    describe('Register product: POST /api/products', () => {            
        
        it('should add product with admin credential', async () => {
            // 10.3
            //expect(() => {}).to.throw(); 
            // 10.5
            const response = await chai
            .request(handleRequest)
            .post(productsUrl)
            .set('Accept', contentType)
            .set('Authorization', `Basic ${adminCredentials}`)
            .send(product);

            const dbProducts = await Product.find({});
            expect(response).to.have.status(201);
            expect(dbProducts).to.be.lengthOf(allProducts.length + 1);
        });

        it('should respond with "403 Forbidden" when customer credential', async () => {
            // 10.3
            // expect(() => {}).to.throw(); 
            // 10.5
            const response = await chai
              .request(handleRequest)
              .post(productsUrl)
              .set('Accept', contentType)
              .set('Authorization', `Basic ${customerCredentials}`)
              .send(product);
    
            expect(response).to.have.status(403);
        });
    });
});
  
