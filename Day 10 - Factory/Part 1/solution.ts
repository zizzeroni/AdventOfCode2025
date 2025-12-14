import fs from 'fs';
import path from 'path';

interface Machine {
    targetState: number[];
    buttons: number[][];
}

let result: number = 0;
const inputPath: string = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);

    for (const line of lines) {
        if (line.trim().length === 0) continue;
        
        const machine = parseMachine(line);
        const minimumPresses = solveMinimumButtonPresses(machine);
        
        if (minimumPresses === -1) {
            continue;
        }
        
        result += minimumPresses;
    }

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function parseMachine(line: string): Machine {
    const indicatorMatch: RegExpMatchArray | null = line.match(/\[([.#]+)\]/);
    if (!indicatorMatch) throw new Error('Invalid indicator format');
    
    const targetState: number[] = indicatorMatch[1].split('').map((char: string) => char === '#' ? 1 : 0);
    
    const buttonMatches: RegExpStringIterator<RegExpExecArray> = line.matchAll(/\(([0-9,]+)\)/g);
    const buttons: number[][] = [];
    
    for (const match of buttonMatches) {
        const lightIndices: number[] = match[1].split(',').map(Number);
        buttons.push(lightIndices);
    }
    
    return { targetState, buttons };
}

function solveMinimumButtonPresses(machine: Machine): number {
    const numberOfLights: number = machine.targetState.length;
    const numberOfButtons: number = machine.buttons.length;

    const matrix: number[][] = Array(numberOfLights).fill(0).map(() => 
        Array(numberOfButtons + 1).fill(0)
    );
    
    for (let buttonIndex: number = 0; buttonIndex < numberOfButtons; buttonIndex++) {
        for (const lightIndex of machine.buttons[buttonIndex]) {
            if (lightIndex < numberOfLights) {
                matrix[lightIndex][buttonIndex] = 1;
            }
        }
    }
    
    for (let lightIndex: number = 0; lightIndex < numberOfLights; lightIndex++) {
        matrix[lightIndex][numberOfButtons] = machine.targetState[lightIndex];
    }
    
    const pivotColumns: number[] = [];
    let pivotRow: number = 0;
    
    for (let columnIndex: number = 0; columnIndex < numberOfButtons; columnIndex++) {
        let foundPivot: boolean = false;

        for (let rowIndex: number = pivotRow; rowIndex < numberOfLights; rowIndex++) {
            if (matrix[rowIndex][columnIndex] === 1) {
                [matrix[pivotRow], matrix[rowIndex]] = [matrix[rowIndex], matrix[pivotRow]];
                foundPivot = true;
                break;
            }
        }
        
        if (!foundPivot) continue;
        
        for (let rowIndex: number = 0; rowIndex < numberOfLights; rowIndex++) {
            if (rowIndex !== pivotRow && matrix[rowIndex][columnIndex] === 1) {
                for (let column: number = 0; column <= numberOfButtons; column++) {
                    matrix[rowIndex][column] ^= matrix[pivotRow][column];
                }
            }
        }
        
        pivotColumns.push(columnIndex);
        pivotRow++;
    }
    
    for (let rowIndex: number = 0; rowIndex < numberOfLights; rowIndex++) {
        let allZeros: boolean = true;
        
        for (let columnIndex: number = 0; columnIndex < numberOfButtons; columnIndex++) {
            if (matrix[rowIndex][columnIndex] === 1) {
                allZeros = false;
                break;
            }
        }

        if (allZeros && matrix[rowIndex][numberOfButtons] === 1) {
            return -1;
        }
    }
    
    const freeVariables: number[] = [];
    
    for (let buttonIndex: number = 0; buttonIndex < numberOfButtons; buttonIndex++) {
        if (!pivotColumns.includes(buttonIndex)) {
            freeVariables.push(buttonIndex);
        }
    }
    
    let minimumPresses: number = Infinity;
    const numberOfCombinations: number = 1 << freeVariables.length;
    
    for (let combination: number = 0; combination < numberOfCombinations; combination++) {
        const buttonPresses: number[] = Array(numberOfButtons).fill(0);
        
        for (let freeVarIndex: number = 0; freeVarIndex < freeVariables.length; freeVarIndex++) {
            if ((combination >> freeVarIndex) & 1) {
                buttonPresses[freeVariables[freeVarIndex]] = 1;
            }
        }
        
        for (let pivotIndex: number = pivotColumns.length - 1; pivotIndex >= 0; pivotIndex--) {
            const rowIndex: number = pivotIndex;
            const columnIndex: number = pivotColumns[pivotIndex];
            
            let value: number = matrix[rowIndex][numberOfButtons];
            
            for (let otherColumn: number = columnIndex + 1; otherColumn < numberOfButtons; otherColumn++) {
                if (matrix[rowIndex][otherColumn] === 1) {
                    value ^= buttonPresses[otherColumn];
                }
            }
            
            buttonPresses[columnIndex] = value;
        }
        
        const totalPresses: number = buttonPresses.reduce((sum: number, presses: number) => sum + presses, 0);
        minimumPresses = Math.min(minimumPresses, totalPresses);
    }
    
    return minimumPresses;
}