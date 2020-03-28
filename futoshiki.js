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


function literalToInt (literal) {
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
        result.push(literalToInt(square+'1') + ' ' + literalToInt(square+'2') + ' ' + literalToInt(square+'3') + ' ' + literalToInt(square+'4') + ' 0');

        for (let value of ['1','2','3','4']) {
            let literal1 = square + value;

            for (let literal2 of giveAllSquaresOnTheSameLineOrColumn(literal1)) {
                result.push('-' + literalToInt(literal1) + ' -' + literalToInt(literal2) + ' 0');
            }
        }
    }
    return result;
}


function addRule (list, rule) {
    let result = 0;
    if (rule.length === 2) {
        list.push(literalToInt(rule) + ' 0');
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

        list.push('-' + literalToInt(square1 + '2') + ' ' + literalToInt(square2 + '3') + ' ' + literalToInt(square2 + '4') + ' 0');
        list.push('-' + literalToInt(square1 + '3') + ' ' + literalToInt(square2 + '4') + ' 0');
        list.push('-' + literalToInt(square1 + '4') + ' 0');
        list.push('-' + literalToInt(square2 + '3') + ' ' + literalToInt(square1 + '1') + ' ' + literalToInt(square1 + '2') + ' 0');
        list.push('-' + literalToInt(square2 + '2') + ' ' + literalToInt(square1 + '1') + ' 0');
        list.push('-' + literalToInt(square2 + '1') + ' 0');
        result = 6;
    }

    return result;
}


function main () {
    let DIMACS = generateFNC();
    let numberOfClauses = 576; // Initial number of clauses

    console.log('Grid :\n  A B C D\n  E F G H\n  I J K L\n  M N O P\n');
    console.log('Enter the known information :');
    console.log('  - A1 : A contain the value 1');
    console.log('  - G<H : The value of G is strictly lower than the one of H');
    console.log('  - "done" to finish');

    /*
    let rule = prompt();

    while (rule!='done') {
        numberOfClauses += addRule(DIMACS,rule);
        rule = prompt();
    }
    */
    numberOfClauses += addRule(DIMACS,'F2');
    numberOfClauses += addRule(DIMACS,'P3');
    numberOfClauses += addRule(DIMACS,'A > B');
    numberOfClauses += addRule(DIMACS,'K < L');
    numberOfClauses += addRule(DIMACS,'J > N');


    //let file = open("FNC.txt","w");
    //file.write("p cnf 64 %s\n" %(numberOfClauses));
    console.log('p cnf 64 ' + numberOfClauses);
    for (let line of DIMACS) {
    //    file.write(line);
    //    file.close();
        console.log(line);
    }
    console.log('The conjunctive normal form  associated to this grid has been written in the file "FNC.txt"');


}



main();
