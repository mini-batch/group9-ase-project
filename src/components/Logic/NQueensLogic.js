export function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}


export function CheckDiagonalsEmpty(position, squareCoord) {
    let file = squareCoord[0];
    let rank = squareCoord[1];
    let index = 0;
    for (let i = 0; i < position.length; i++) {
        if (position[i] === -1) {
            index += 1;
            continue;
        }
        else if (index === file) {
            index += 1;
            continue;
        } else {
            if (Math.abs(file - index) === Math.abs(rank - position[index])) {
                return false;
            }
        }
        index += 1;
    }
    return true;
}


export function CheckSolutionValid(position) {
    let index = 0;
    for (let i = 0; i < position.length; i++)
    {
        if (position[i] === -1) {
            return false;
        }
        else {
            if (CheckDiagonalsEmpty(position, [index, position[index]])) {
                index += 1;
                continue;
            }
            else {
                return false;
            }
        }
    }
    return true;
}


export function SetPermutationAroundPosition (n, inputPosition, permutation) {
    let permIndex = 0;
    for (let i = 0; i < n; i++) {
        if (inputPosition[i] === -1) {
            inputPosition[i] = permutation[permIndex];
            permIndex += 1;
        }
    }
    return inputPosition;
}


export function GetSolutionBruteForce (n, position) {
    let freeVariables = [];
    for (let i = 0; i < n; i ++) {
        if (position.indexOf(i) === -1) {
            freeVariables.push(i);
        }
    }
    let permutations = permute(freeVariables);
    for (let j = 0; j < permutations.length; j++) {
        let pos = position.slice();
        let solution = SetPermutationAroundPosition(n, pos, permutations[j]);
        if (CheckSolutionValid(solution)) {
            return solution;
        }
    }
    return -1;
}
