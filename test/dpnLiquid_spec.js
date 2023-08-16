var helper = require("node-red-node-test-helper");
var dpnLiquid = require("../src/liquid/dpnLiquid.js");

describe('Deeper Network Liquid Node', function () {

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ 
      id: "n1", 
      type: "dpnLiquid", 
      name: "test name",
      token: "token"
    }];
    helper.load(dpnLiquid, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');

      done();
    });
  });

  it('should make payload contain the liquid value.', function (done) {
    var flow = [{ 
      id: "n1", 
      type: "dpnLiquid", 
      name: "test name",
      token: "token",
      wires:[["n2"]] },
    { id: "n2", type: "helper" }];
    helper.load(dpnLogin, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.payload.should.be.not.empty();
        msg.payload.liquid.should.be.not.empty();
        msg.payload.liquid.should.be.not.equal('Start');
        //msg.payload.token.should.be.not.empty();
        //msg.payload.encryptedPassword.should.be.not.empty();
        done();
      });
      n1.receive({ payload: "Start" });
    });
  });
});