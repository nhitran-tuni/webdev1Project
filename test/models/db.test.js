const { expect } = require('chai');
const { getDbUrl,connectDB,disconnectDB } = require('../../models/db');
const mongoose = require('mongoose');

const dbConfig = {
  host: 'localhost',
  port: 27017,
  db: 'Test_WebShopDb'
};

describe('getDbUrl()', () => {
  let envBackup;

  beforeEach(() => {
    envBackup = process.env.DBURL;
  });

  afterEach(() => {
    delete process.env.DBURL;
    if (envBackup) process.env.DBURL = envBackup;
    envBackup = undefined;
  });

  it('must return default database URL if DBURL is not defined', () => {
    delete process.env.DBURL;
    expect(getDbUrl()).to.equal('mongodb://localhost:27017/WebShopDb');
  });

  it('must return DBURL defined in environment variable', () => {
    const dbUrl = 'mongodb://testhost.12345/dbName';
    process.env.DBURL = dbUrl;
    expect(getDbUrl()).to.equal(dbUrl);
  });
});

describe('connectDB()', () => {
  beforeEach(() => {
    mongoose.disconnect();
  });
  it('must connect to DB if disconnected', () => {
    expect(connectDB()).to.be.undefined;
  });
});

describe('disconnectDB()', () => {
  afterEach(() => {
    connectDB();
  });
  it('must disconnect DB if connected', () => {
      expect(disconnectDB()).to.be.undefined;
  });
});


