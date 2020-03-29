// Project INF402

function giveAllSquaresOnTheSameLineOrColumn (literal) {
    let square = literal[0];
    let value = literal[1];
    let result = [];
    for (let i=1; i<=4; i++) {
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


function searchIndexInList (list, element) {
    let result = -1;
    for (let i=0; i<list.length; i++) {
        if (list[i] === element) {
            result = i;
        }
    }
    return result;
}


function literal2int (literal) {
    let square = literal[0];
    let value = literal[1];

    let A = searchIndexInList(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'],square);
    console.log(square + ' : ' + A);
    let B = parseInt(value);

    return 4*A+B;
}


function generateFNC () {
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


function addRule (list, rule) {
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


function rpl2dimacs (rpl) {
    let dimacs = generateFNC();
    let numberOfClauses = 576; // Initial number of clauses

    for (let rule of rpl) {
        numberOfClauses += addRule(dimacs,rule);
    }
    dimacs.splice(0,0,'p cnf 64 ' + numberOfClauses + '<br>');

    return dimacs;
}

