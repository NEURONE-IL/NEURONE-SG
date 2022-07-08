process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;
let userId;

/*
@vjlh:
Test suite for AdventureSearch API.
*/
describe('AdventureSearch API', () => {
  /*
  @vjlh:
  Tries to authenticate the default user to get a JWT before apply each test.
  */    
  before((done) => {
      chai.request(app)
      .post('/api/auth/login')
      .send({
          email: 'admin@admin.com',
          password: 'admin123'
      })
      .end((err, res) => {
          token = res.body.token;
          userId = res.body.user._id;
          res.should.have.status(200);
          done();
      });
  });

  /*
  @vjlh:
  Successful test for get route search adventures for query
  */
  describe('/GET/search/:userId/:query/:page searchAdventures', () => {
    it('It should GET all relevant adventures for a query', (done) => {
      let query = 'aventura';
      let page = '1';
      chai.request(app)
      .get('/api/adventureSearch/search/'+userId+'/'+query+'/'+page)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventures search successfully get');
        res.body.should.have.property('actualPage').eql(page);
        res.body.should.have.property('totalDocs');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
  
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get route search all public adventures
  */
  describe('/GET/search/:userId/:query/:page searchAdventures', () => {
    it('It should GET all adventures available for search', (done) => {
      let query = 'all';
      let page = '1';
      chai.request(app)
      .get('/api/adventureSearch/search/'+userId+'/'+query+'/'+page)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventures search successfully get');
        res.body.should.have.property('actualPage').eql(page);
        res.body.should.have.property('totalDocs');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get route search no results
  */
  describe('/GET/search/:userId/:query/:page searchAdventures', () => {
    it('It should GET no result adventures for a query', (done) => {
      let query = 'NotResultTest';
      let page = '1';
      chai.request(app)
      .get('/api/adventureSearch/search/'+userId+'/'+query+'/'+page)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventures search successfully get');
        res.body.should.have.property('actualPage').eql(page);
        res.body.should.have.property('totalDocs');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
        res.body.docs.length.should.be.eql(0);
        done();
      });
    });
  });



});