
const expect = require('chai').expect;

describe('oauth', function() {
    describe('/oauth/token', function () {
        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(4)).equal(-1)
        });
        it('should return 1 when the value is present', function () {
            expect([1, 2, 3].indexOf(2)).equal(1)
        });
        it('should return 0 when the value is present', function () {
            expect([1, 2, 3].indexOf(3)).not.equal(1)
        });
    });
    describe('/oauth/token_key', function () {

    });
    describe('/oauth/check_token', function () {

    });
});
