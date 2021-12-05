# Group 

Member1:  Shamshad Akther, shamshad.akther@tuni.fi, H292957, 
resposible for: Implementing and testing controller for product, routes for product, models for product, view for product, add to cart, increment item in cart, decrement item in cart, shopping cart list,own test for product [models, controller, routes] and order [controller] for coverage, some fix of eslint and jsdoc, fix new test for User controller, Product Controller, simple frontend design and css product, cart and order

Member2:  Thuy Phuong Nhi Tran, thuyphuongnhi.tran@tuni.fi, H291937, 
resposible for: Routes for order, model for order and user, view for order, place a new order, order frontend, fix error eslint, jsdoc and SonarQube, sort products by name and price



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS.


### The project structure

```
.
├── index.js                --> home page
├── package.json            --> Includes all necessary dependency packages
├── routes.js               --> include routes to handle get all products, view product details, delete product, and product 
├── auth                    --> Authorization
│   └──  auth.js            --> return the current user using page
├── controllers             --> include controller for users, products and orders
│   ├── products.js         --> include controller to handle get all products, view product details, delete product, and order 
│   └── users.js            --> controller for user
|   |__ order.js            --> controller for order (view base on account, place an order, delete)
├── models                  --> Mongodb schema
│   ├── products.js         --> include model for product
│   ├── order.js            --> include model for order
│   └── users.js            --> controller for user
├── public                  --> folder for styling, images, scripts
│   ├── img                 --> images for readme.md
│   ├── js                  --> scripts for product, users, order
│   └── css                 --> style for page
├── utils                   --> include utilities for product, user, response, request
│   ├── responseUtils       --> utilities for response
│   ├── requestUtils        --> utilities for request
│   ├── products            --> utilities for product
│   └── users               --> utitlities for user
└── test                    --> tests
│   ├── auth                --> authorization test
│   ├── controllers         --> controller related test for order, products, users
└── └── own                 --> test for product [models, controller, routes]


```

TODO: describe added files here and give them short descriptions
- image folder added under public folder
- product add related html, js file added under public

## The architecture 

TODO: describe the system, important buzzwords include MVC and REST.
UML diagrams would be highly appreciated.

1. Description:

    The System follows MVC structure where all the interaction between model and view are managed in controller, all user interaction are managed in view and all data store and retrivtion is managed in Model. 

    ![MVC Diagram](/public/img/mvc.png "MVC Diagram")

    The complete System is designed to support REST api with necessary access right based on type of user role.

2. UML Diagram:
    
    ![Sequence Diagram](/public/img/uml.png "Sequence Diagram")

3. Data Models:

    - User:
        - Model: User
        - Attributes: [ name :String, email : String, password : String, role : String]
        - Description: User Model is used to register new user as customer or admin.
    - Product:
        - Model: Product
        - Attributes: [  name : String, description : String, price : Number, image : String]
        - Description: Product Model is used to register new product for purchase.
    - Order:
        - Model: Order
        - Attributes: [  customerId : ObjectId, items : { _id : ObjectId, name : String, description : String, price : Decimel }, quantity : Number }]
        - Description: Order Model is used to store purchase order information for user.

## Tests and documentation

TODO: Links to at least 10 of your group's GitLab issues, and their associated Mocha tests and test files.

1. [Admin can add new products if they do not exist][test-1]

2. [When add new products, product id cannot be null][test-2]

3. [Product id is unique][test-3]

4. [Product name cannot be null][test-4]

5. [Customers cannot add products][test-5]

6. [Admin can remove existing products and throw error if admin try to remove products that do not exist][test-6]

7. [Customer cannot delete product][test-7]

8. [Product price canot be 0 or less][test-8]

9. [Admin can change price of products][test-9]

10. [Only price can be updated][test-10]

[Mocha test and test File associated with above tests][test-11]

[test-1]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/2
[test-2]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/3
[test-3]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/4
[test-4]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/5
[test-5]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/6
[test-6]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/7
[test-7]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/8
[test-8]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/9
[test-9]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/10
[test-10]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/issues/11
[test-11]: https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-73/-/blob/master/test/own/product.test.js

## Security concerns

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

- Input Data : Generally user input should never be trusted. Many of the vulnerabilities used to rely on user input not being validated. Out user input is validated

- Injection Attacks
    + CROSS-SITE SCRIPTING : Very common and basic attack. The attacker formats input in a way, that JavaScript gets executed when that page is shown to other users. 

    + SQL INJECTION ATTACKS: hijack control over the web application database.

    + DATA INJECTION: gives instructions that have not been authorized.

    This attacks result in data leaking, removal ot manipulation of stored database. These mentioned injection attacks primarly to give user instructions that are not authorized as well.

    To prevent these threats, our form converts the input to string and scripts are displayes as it is in the pages. Also asking for user rights and authorization for actions are minimized.

- BRUTE FORCE ATTACKS: hackers will try attempt to guess passwords and gain access to the web application. We preven this attack by encrypt data (password), it will ensure that hackers are difficult to make use of anything unless they have encryption keys (salt). Prevent this happen, unlimited the number of user login is also a good solution, but our application is to sell products so it is not a good idea to limit the number of users. 

- CROSS-SITE REQUEST FORGERY (CSRF): hackers will use social engineering tricks to implement CSRF by sending links to authenticated users, who are already logged into a web application, on social media. Ways to prevent is to encrypt data and generate random tokens

## Finalization

For our web application, there is a navigation bar contain all the links navigate to all pages.

The register page does not need users to login and after user fills in form that satisfy all requirements, the user register successful and all data of the user will be store and the password will be encrypted for further security.

The List Users page will require the user to login. If the user login as admin account, it will list all the available users. If the user is customer, the page is blank.

The Add product page will require the user to login. The action of adding order successfully only when the user is admin and all inputs are meet all the requirements.

The List Products page will require the user to login. All the products will be listed only when the user login successfully. USer can sort products by name or price.

The Shopping cart page will require the user to login. When the "add to cart" button is clicked, the product information will be in Shopping cart page. Only customer can place the order successfilly.

The Orders page will require the user to login. If the user is admin, all available orders will be lised. If user is customer, only own customer orders(s) will be listed.

