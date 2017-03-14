//global.DATABASE_URL = 'mongodb://localhost/gameswap';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('gameswap', function() {
    before(function(done) {
        server.runServer(function() {
            done();
        });
    });

    it('should return status 200 and html on url call', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});
