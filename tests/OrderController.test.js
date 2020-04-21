
const expect = require('chai').expect; //依赖于Node

describe('OrderController', function() {
    describe('/order/create', function () {
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
});