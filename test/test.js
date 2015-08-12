/*var assert = require("assert");
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});*/

describe('Redis', function() {
  describe('#getConnection()', function() {
    it('should come without error', function(done) {
      var redis = new Redis('Luna');
      user.save(function(err) {
        if (err) throw err;
        done();
      });
    });
  });
});
