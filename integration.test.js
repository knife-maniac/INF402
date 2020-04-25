const assert = require('assert');
const futoshiki = require('./futoshiki.js');



describe('integration tests', function() {

    function number_of_occurrences_in_array(arr, x) {
        return arr.filter(e=>e===x).length;
    }

    function solution_is_valid(solution) {
        let is_valid = true;

        for (const row of solution) {
            is_valid &= number_of_occurrences_in_array(row, '1') === 1;
            is_valid &= number_of_occurrences_in_array(row, '2') === 1;
            is_valid &= number_of_occurrences_in_array(row, '3') === 1;
            is_valid &= number_of_occurrences_in_array(row, '4') === 1;
        }

        for (let i = 0; i < 4; i++) {
            const column = [solution[0][i], solution[1][i], solution[2][i], solution[3][i]];
            is_valid &= number_of_occurrences_in_array(column, '1') === 1;
            is_valid &= number_of_occurrences_in_array(column, '2') === 1;
            is_valid &= number_of_occurrences_in_array(column, '3') === 1;
            is_valid &= number_of_occurrences_in_array(column, '4') === 1;
        }

        return is_valid;
    }


    function solution_respects_constraints (solution,rpl) {
        let result = true;
        for (const constraint of rpl.split().filter(e=>e.length>0)) {
            const square_name = constraint[0];
            const square_value = solution.flat()[futoshiki.SQUARES.indexOf(square_name)];
            const operator_or_value = constraint[1];
            if (['<','>'].includes(operator_or_value)) {
                const operator = operator_or_value;
                const other_square_name = constraint[2];
                const other_square_value = solution.flat()[futoshiki.SQUARES.indexOf(other_square_name)];
                result &= (operator==='<')? square_value<other_square_name : other_square_value<square_value;
            } else {
                const value = operator_or_value;
                result &= value === square_value;
            }
            if (!result) {
                break;
            }

        }
        return result;
    }


    const INTEGRATION_TESTS = [
        ['no value no \\n', '',true],
        ['no value with \\n', '\n',true],
        ['one value', 'A1\n',true],
        ['three values', 'A1\nB2\nD4\n',true],
        ['three values + one inferior sign', 'A1\nB2\nD4\nK<O\n',true],
        ['three values + one superior sign', 'A1\nB2\nD4\nK>O\n',true],

        ['two impossible values same square', 'A1\nA2\n',false],
        ['two impossible values same line adjacent', 'A1\nB1\n',false],
        ['two impossible values same line extremes', 'A2\nD2\n',false],
        ['two impossible values same column', 'A4\nM4\n',false]
    ];

    INTEGRATION_TESTS.map(function([name,rpl,has_solution]) {
        it(`must ${has_solution ? 'succeed':'fail'} with ${name}`, function() {
            let success = false;
            let puzzle;
            try {
                puzzle = futoshiki.run(rpl);
                if (puzzle.solution_as_array.length) {
                    if (solution_is_valid(puzzle.solution_as_array) && solution_respects_constraints(puzzle.solution_as_array,rpl)) {
                        success = true;
                    }
                } else {
                    success = !has_solution;
                }
            } catch (e) {
                console.log(e);

            }
            assert(success);
        });
    });
});
