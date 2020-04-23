const assert = require('assert');
const futoshiki = require('./futoshiki.js');


console.log('Hello world !');
const result = futoshiki.run('A1\n');

console.log(result.solution_as_array);



describe('unit tests', function() {
    describe('literal2int()', function() {
        it('must return 1 for A1', function() {
            assert(futoshiki.literal2int('A1')==1);
        });

    });
});
