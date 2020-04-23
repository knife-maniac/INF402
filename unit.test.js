const assert = require('assert');
const futoshiki = require('./futoshiki.js');


describe('unit tests', function() {
    describe('literal2int()', function() {
        it('must return 1 for A1', function() {
            assert(futoshiki.literal2int('A1')==1);
        });

    });
});
