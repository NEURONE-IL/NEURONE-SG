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
let adventure;
let cloneAdventure;

/*
@vjlh:
Test suite for Adventure API New Implementations.
*/
describe('Adventure API New Implementations', () => {
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
  Successful test for POST route    
  */
  describe('/POST adventure', () => {
    it('It should POST a adventure', (done) => {
      let adventureTestBody = {
        name: 'Adventure Creation Test',
        description: 'Adventure Description Test',
        preconditions: [],
        image_id:'',
        user: userId,
        privacy: false,
        collaborators: '[]',
        tags: '["test","create"]',     
      }
      chai.request(app)
      .post('/api/adventure/new')
      .set({ 'x-access-token': token })
      .send(adventureTestBody)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventure succesfully created');
        res.body.should.have.property('adventure');
        res.body.adventure.should.have.property('name');
        res.body.adventure.should.have.property('description');
        res.body.adventure.should.have.property('preconditions');
        res.body.adventure.should.have.property('nodes');
        res.body.adventure.should.have.property('links');
        res.body.adventure.should.have.property('user');
        res.body.adventure.should.have.property('privacy');
        res.body.adventure.should.have.property('collaborators');
        res.body.adventure.should.have.property('type');
        res.body.adventure.should.have.property('tags');
        adventure = res.body.adventure;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by user route 
  */
  describe('/GET/byUser/:userId Adventures by User', () => {
    it('It should GET all adventures of a particular user', (done) => {
      chai.request(app)
      .get('/api/adventure/byUser/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Adventures by user successfully get');
          res.body.should.have.property('adventures');
          res.body.adventures.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get by user by privacy route 
  */
  describe('/GET/byUserbyPrivacy/:userId/:privacy Adventures by User', () => {
    it('It should GET all adventures of a particular user filtered by privacy (public / private)', (done) => {
      chai.request(app)
      .get('/api/adventure/byUserbyPrivacy/'+userId+'/true')
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Adventures by user by privacy successfully get');
          res.body.should.have.property('adventures');
          res.body.adventures.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get by type route 
  */
  describe('/GET/byUserbyType/:userId/:type adventures by User', () => {
    it('It should GET all adventures of a particular user filtered by type (cloned / own)', (done) => {
      chai.request(app)
      .get('/api/adventure/byUserbyType/'+userId+'/own')
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Adventures by user by type successfully get');
          res.body.should.have.property('adventures');
          res.body.adventures.should.be.a('array');
      done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by user for collaboration 
  */
  describe('/GET/byUserCollaboration/:userId/ adventures by User', () => {
    it('It should GET all adventures of a particular user in which is collaborator', (done) => {
      chai.request(app)
      .get('/api/adventure/byUserCollaboration/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Adventures by user in which is collaborator successfully get');
        res.body.should.have.property('adventures');
        res.body.adventures.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get cloning route 
  */
  describe('/POST/clone/:adventureId adventure', () => {
    it('It should POST a generated cloned adventure', (done) => {
      let body = {
        user_id: userId 
      }
      chai.request(app)
      .post('/api/adventure/clone/'+adventure._id)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventure successfully cloned');
        res.body.should.have.property('adventure');
        res.body.adventure.should.have.property('name');
        res.body.adventure.should.have.property('description');
        res.body.adventure.should.have.property('preconditions');
        res.body.adventure.should.have.property('nodes');
        res.body.adventure.should.have.property('links');
        res.body.adventure.should.have.property('user').eql(userId);
        res.body.adventure.should.have.property('privacy');
        res.body.adventure.should.have.property('collaborators');
        res.body.adventure.should.have.property('type').eql('clone');
        res.body.adventure.should.have.property('tags');
        cloneAdventure = res.body.adventure._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put request for edit route 
  */
  describe('/PUT/requestEdit/:adventureId adventure', () => {
    it('It should PUT edit field of a adventure to give a user edit permission', (done) => {
      let body = {
        user: userId
      }
      chai.request(app)
      .put('/api/adventure/requestEdit/'+adventure._id)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Current user for edit successfully updated');
        res.body.should.have.property('userEdit');
        res.body.userEdit.should.have.property('_id').eql(userId);
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put route 
  */
  describe('/PUT/:adventureId flow', () => {
    it('It should PUT a flow', (done) => {

      delete adventure.nodes[0]._id
      let adventurePutTestBody = {
        name: 'Adventure Updated Creation Test',
        description: 'Adventure Updated Description Test',
        preconditions: adventure.preconditions,
        privacy: true,
        collaborators: adventure.collaborators,
        nodes: adventure.nodes,
        links: adventure.links,
        tags: ["test","create","update"],     
      }
      chai.request(app)
      .put('/api/adventure/'+adventure._id)
      .set({ 'x-access-token': token })
      .send(adventurePutTestBody)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventure succesfully updated');
        res.body.should.have.property('result');
        res.body.result.should.have.property('name');
        res.body.result.should.have.property('description');
        res.body.result.should.have.property('preconditions');
        res.body.result.should.have.property('nodes');
        res.body.result.should.have.property('links');
        res.body.result.should.have.property('user');
        res.body.result.should.have.property('privacy');
        res.body.result.should.have.property('collaborators');
        res.body.result.should.have.property('type');
        res.body.result.should.have.property('tags');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put release edit route 
  */
  describe('/PUT/releaseAdventure/:adventureId adventure', () => {
    it('It should PUT edit list of a adventure to release edition from a user', (done) => {
      let body = {
        user: userId
      }
      chai.request(app)
      .put('/api/adventure/releaseAdventure/'+adventure._id)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Adventure released for edit');
          res.body.should.have.property('adventure').should.be.a('object');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put edit collaborators route 
  */
  describe('/PUT/editCollaborator/:adventureId adventure', () => {
    it('It should PUT collaborator list of a adventure', (done) => {
      let body = {
        collaborators: [{user:'628e8c3f4e6ed8186ad926ad', invitation:'Pendiente'}]
      }
      chai.request(app)
      .put('/api/adventure/editCollaborator/'+adventure._id)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Collaborators list successfully updated');
          res.body.should.have.property('adventure');
          res.body.adventure.should.be.a('object');
          res.body.adventure.should.have.property('collaborators');
          res.body.adventure.collaborators.length.should.be.eql(1);
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for delete by id route 
  */
  describe('/DELETE/:adventureId adventure', () => {
    it('It should DELETE an adventure given the id', (done) => {
      chai.request(app)
      .delete('/api/adventure/' + adventure._id)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventure successfully deleted');
      });
      chai.request(app)
      .delete('/api/adventure/' + cloneAdventure)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Adventure successfully deleted');
        done();
      });
    });
    
  });
  

})