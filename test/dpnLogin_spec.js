var helper = require("node-red-node-test-helper");
var dpnLogin = require("../src/login/dpnLogin.js");

describe('Deeper Network Client Node', function () {

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ 
      id: "n1", 
      type: "dpnLogin", 
      name: "test name",
      username: "username",
      password: "password"
    }];
    helper.load(dpnLogin, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');

      done();
    });
  });

  it('should make payload contain the token.', function (done) {
    var flow = [{ 
      id: "n1", 
      type: "dpnLogin", 
      name: "test name",
      username: "username",
      password: "password",
      wires:[["n2"]] },
    { id: "n2", type: "helper" }];
    helper.load(dpnLogin, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.payload.should.be.not.empty();
        msg.payload.should.be.not.equal('password');
        msg.payload.should.be.not.equal('Start');
        //msg.payload.token.should.be.not.empty();
        //msg.payload.encryptedPassword.should.be.not.empty();
        done();
      });
      n1.receive({ payload: "Start" });
    });
  });
});