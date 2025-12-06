import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const grid: string[] = content.split(/\r?\n/);

    grid.forEach((gridRow: string, gridRowIndex: number) => {
        for(let cellIndex: number = 0; cellIndex < gridRow.length; cellIndex++) {
            if(isRollOfPaper(gridRow[cellIndex])) {
                result += checkAdjactentCells(grid, gridRow, cellIndex, gridRowIndex);
            }
        }
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function checkAdjactentCells(grid: string[], gridRow: string, cellIndex: number, gridRowIndex: number): number {
    let numberOfAdjacentRolls = 0;

    if(gridRowIndex != 0) {
        if(cellIndex != 0) {
            numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex - 1][cellIndex - 1]);
        }

        if(cellIndex != gridRow.length - 1) {
            numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex - 1][cellIndex + 1]);
        }

        numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex - 1][cellIndex]);
    }

    if(cellIndex != 0) {
        numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex][cellIndex - 1]);
    }

    if(cellIndex != gridRow.length - 1) {
        numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex][cellIndex + 1]);
    }

    if(gridRowIndex != grid.length - 1) {
        if(cellIndex != 0) {
            numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex + 1][cellIndex - 1]);
        }

        if(cellIndex != gridRow.length - 1) {
            numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex + 1][cellIndex + 1]);
        }

        numberOfAdjacentRolls += isRollOfPaper(grid[gridRowIndex + 1][cellIndex]);
    }

    if(numberOfAdjacentRolls > 3) {
        return 0;
    }

    return 1;

}

function isRollOfPaper(cell: string): number {
    if(cell === '@') {
        return 1;
    }

    return 0;
}