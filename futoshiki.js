// Project INF402

/* istanbul ignore else */
if (typeof module !== 'undefined') {
    global.minisat = require('./lib/minisat.js');
}

const SQUARES = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];


function giveAllSquaresOnTheSameLineOrColumn(literal) {
    const square = literal[0];
    const value = literal[1];
    let result = [];
    for (let i=1; i<=4; ++i) {
        if (i!=value) {
            result.push(square+i);
        }
    }

    const lines = [['A','B','C','D'],
                   ['E','F','G','H'],
                   ['I','J','K','L'],
                   ['M','N','O','P']];

    for (const line of lines) {
        if (line.includes(square)) {
            for (const squareOnTheSameLine of line) {
                if (squareOnTheSameLine!=square) {
                    result.push(squareOnTheSameLine+value);
                }
            }
        }
    }

    const columns = [['A','E','I','M'],
                     ['B','F','J','N'],
                     ['C','G','K','O'],
                     ['D','H','L','P']];

    for (const column of columns) {
        if (column.includes(square)) {
            for (const squareOnTheSameColumn of column) {
                if (squareOnTheSameColumn!=square) {
                    result.push(squareOnTheSameColumn+value);
                }
            }
        }
    }

    return result;

}


function literal2int(literal) {
    const isNegative = literal[0]==='-';
    const square = isNegative? literal[1]:literal[0];
    const value = isNegative? literal[2]:literal[1];

    const A = SQUARES.indexOf(square);
    const B = parseInt(value);

    const unsigned_result = 4*A+B;
    const result = isNegative? -unsigned_result:unsigned_result;
    return result;
}

function int2literal(value) {
    let letterIndex = 0;
    while(value>4) {
        value-=4;
        ++letterIndex;
    }
    return SQUARES[letterIndex] + value;
}


function generateGameRules() {
    let result = [];
    for (let square of SQUARES) {
        result.push(literal2int(square+'1') + ' ' + literal2int(square+'2') + ' ' + literal2int(square+'3') + ' ' + literal2int(square+'4') + ' 0');

        for (let value of ['1','2','3','4']) {
            let literal1 = square + value;

            for (let literal2 of giveAllSquaresOnTheSameLineOrColumn(literal1)) {
                result.push('-' + literal2int(literal1) + ' -' + literal2int(literal2) + ' 0');
            }
        }
    }
    return result;
}


function addClauseAndReturnNumberOfLiteralsOfRpl(list, clause_as_rpl) {
    const literals = clause_as_rpl.split(' ');
    let clause_as_dimacs = [];
    for (const literal of literals) {
        clause_as_dimacs.push(literal2int(literal));
    }
    clause_as_dimacs.push('0');
    list.push(clause_as_dimacs.join(' '));
    return literals.length;
}


function rpl2fnc(rpl) {
    let fnc = [];
    rpl = rpl.split('\n');
    rpl = rpl.slice(0,-1);

    for (let rule of rpl) {
        if (rule[1]=='>' || rule[1]=='<') {
            let literal1;
            let literal2;
            if (rule[1]=='<') {
                literal1 = rule[0];
                literal2 = rule[2];
            } else {
                literal1 = rule[2];
                literal2 = rule[0]
            }
            fnc.push('-' + literal1 + '2 ' + literal2 + '3 ' + literal2 + '4');
            fnc.push('-' + literal1 + '3 ' + literal2 + '4');
            fnc.push('-' + literal1 + '4');
            fnc.push('-' + literal2 + '3 ' + literal1 + '1 ' + literal1 + '2');
            fnc.push('-' + literal2 + '2 ' + literal1 + '1');
            fnc.push('-' + literal2 + '1');
        } else {
            fnc.push(rule);
        }
    }

    return fnc.join('\n');
}


function fnc2dimacs(fnc) {
    let dimacs = [];
    let numberOfClauses = 576; // Initial number of clauses
    if (fnc.length) {
        fnc = fnc.split('\n');
    }

    for (let clause of fnc) {
        numberOfClauses += addClauseAndReturnNumberOfLiteralsOfRpl(dimacs,clause);
    }
    dimacs.splice(0,0,'p cnf 64 ' + numberOfClauses);

    const gameRules = generateGameRules();
    dimacs = dimacs.concat(gameRules);
    return dimacs.join('\n');
}


function dimacs2pretty(dimacs) {
    const result = [];
    const isSat = dimacs[0]==='S';

    if (isSat) {
        const variables = dimacs.slice(4).split(' ');

        const literals = [];
        for (const variable of variables) {
            if (variable[0]!='-') {
                literals.push(int2literal(variable));
            }
        }

        for (let row=0; row<4; ++row) {
            const line = [];
            for (let col=0; col<4; ++col) {
                line.push(literals[4*row+col][1]);
            }
            result.push(line);
        }
    }

    return result;
}


function run(rpl) {
    const fnc = rpl2fnc(rpl);
    const puzzle_as_dimacs = fnc2dimacs(fnc);
    const solution_as_dimacs = minisat.solve(puzzle_as_dimacs);
    const solution_as_array = dimacs2pretty(solution_as_dimacs);
    return {
        rpl,
        fnc,
        puzzle_as_dimacs,
        solution_as_dimacs,
        solution_as_array
    };
}



const futoshiki = {
    SQUARES,

    literal2int,
    int2literal,
    addClauseAndReturnNumberOfLiteralsOfRpl,
    run
};
/* istanbul ignore else */
if (typeof module !== 'undefined') module.exports = futoshiki;
