// Project INF402

function solve(problem_as_dimacs) {
    var solve_string = Module.cwrap('solve_string', 'string', ['string', 'int']);
    var oldPrint = Module.print;
    var oldPrintErr = Module.printErr;
    let result='';
    Module['print'] = function(x) {
        result+='***:'+x;
        alert(x);
    }
    Module['printErr'] = function(err) {
        result+='ERR:'+err;
        alert(err);
    }
    try {
        //var startTime = (new Date()).getTime();
        result += solve_string(problem_as_dimacs, problem_as_dimacs.length);
        //var endTime = (new Date()).getTime();
        //outputElem.value += 'CPU time: ' + ((endTime - startTime) / 1000) + 's\n';
    } catch(e) {
        Module.printErr('Error: ' + e);
    }
    Module.print = oldPrint;
    Module.printErr = oldPrintErr;

    return result;
}


function giveAllSquaresOnTheSameLineOrColumn(literal) {
    let square = literal[0];
    let value = literal[1];
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

    for (let line of lines) {
        if (line.includes(square)) {
            for (let squareOnTheSameLine of line) {
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

    for (let column of columns) {
        if (column.includes(square)) {
            for (let squareOnTheSameColumn of column) {
                if (squareOnTheSameColumn!=square) {
                    result.push(squareOnTheSameColumn+value);
                }
            }
        }
    }

    return result;

}


function literal2int(literal) {
    let square = literal[0];
    let value = literal[1];

    let A = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'].indexOf(square);
    let B = parseInt(value);

    return 4*A+B;
}

function int2literal(value) {
    const squares = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];
    let letterIndex = 0;
    while(value>4) {
        value-=4;
        ++letterIndex;
    }
    return squares[letterIndex] + value;
}


function generateCNF() {
    let result = [];
    for (let square of ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P']) {
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


function addRule(list, rule) {
    let result = 0;
    if (rule.length === 2) {
        list.push(literal2int(rule) + ' 0');
        result = 1;
    } else if (rule.length === 3 || rule.length === 5) {
        let square1, square2;
        if (rule[1] === '<' || rule[2] === '<') {
            square1 = rule[0];
            square2 = rule[rule.length-1];
        } else {
            square1 = rule[rule.length-1];
            square2 = rule[0];
        }

        list.push('-' + literal2int(square1 + '2') + ' ' + literal2int(square2 + '3') + ' ' + literal2int(square2 + '4') + ' 0');
        list.push('-' + literal2int(square1 + '3') + ' ' + literal2int(square2 + '4') + ' 0');
        list.push('-' + literal2int(square1 + '4') + ' 0');
        list.push('-' + literal2int(square2 + '3') + ' ' + literal2int(square1 + '1') + ' ' + literal2int(square1 + '2') + ' 0');
        list.push('-' + literal2int(square2 + '2') + ' ' + literal2int(square1 + '1') + ' 0');
        list.push('-' + literal2int(square2 + '1') + ' 0');
        result = 6;
    }

    return result;
}


function rpl2fnc(rpl) {
    let fnc = [];
    rpl = rpl.split('\n');
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


function rpl2dimacs(rpl) {
    let dimacs = [];
    let numberOfClauses = 576; // Initial number of clauses

    for (let rule of rpl) {
        numberOfClauses += addRule(dimacs,rule);
    }
    dimacs.splice(0,0,'p cnf 64 ' + numberOfClauses);

    const fnc = generateCNF();
    dimacs = dimacs.concat(fnc);
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
