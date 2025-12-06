import fs from 'fs';
import path from 'path';

let result: number = 0, _result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const grid: string[] = content.split(/\r?\n/);
    
    while(result != _result || result == 0) {
            _result = result;
        grid.forEach((gridRow: string, gridRowIndex: number) => { 
            
            if(gridRow.indexOf('@') != -1) {
                for(let cellIndex: number = 0; cellIndex < gridRow.length; cellIndex++) {
                
                    if(isRollOfPaper(gridRow[cellIndex])) {
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

                        if(numberOfAdjacentRolls <= 3) {
                            result += 1;
                            grid[gridRowIndex] = grid[gridRowIndex].slice(0, cellIndex) + "." + grid[gridRowIndex].slice(cellIndex + 1);
                        }


                    }
                }
            }
        });
    };

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function isRollOfPaper(cell: string): number {
    if(cell === '@') {
        return 1;
    }

    return 0;
}