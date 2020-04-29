const assert = require('assert');
const futoshiki = require('./futoshiki.js');


describe('unit tests', function() {
    const CORRESPONDENCE_BETWEEN_LITERALS_AND_INT = [
        ['A1', 1],
        ['B3', 7],
        ['P4', 64]
    ];
    describe('literal2int() and int2literal()', function() {
        CORRESPONDENCE_BETWEEN_LITERALS_AND_INT.map(function([literal,int]) {
            it(`${int} must correspond to ${literal}`, function() {
                assert(futoshiki.literal2int(literal)===int, 'literal2int');
                assert(futoshiki.int2literal('' + int) === literal,'int2literal');
            });
        });
    });
    describe('addClause()', function() {
        let rpl = [];
        it('must return length of 3 when adding 3 elements', function() {
            assert(futoshiki.addClauseAndReturnNumberOfLiteralsOfRpl(rpl,'A1 B3 D2\n')===3);
        });
    });

    //TODO add missing unit tests
    describe('TODO', function() {
        it('rpl2fnc()');
        it('fnc2dimacs()');
        it('dimacs2pretty()');
    });
});
