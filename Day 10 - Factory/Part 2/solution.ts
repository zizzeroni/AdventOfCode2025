import fs from 'fs';
import path from 'path';

interface Machine {
    joltageRequirements: number[];
    buttons: number[][];
}

class Fraction {
    public numerator: number;
    public denominator: number;

    constructor(numerator: number, denominator: number = 1) {
        if (denominator === 0) throw new Error("Division by zero");
        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }

        const commonDivisor: number = this.greatestCommonDivisor(Math.abs(numerator), denominator);
        this.numerator = numerator / commonDivisor;
        this.denominator = denominator / commonDivisor;
    }

    public add(fraction: Fraction): Fraction {
        return new Fraction(
            this.numerator * fraction.denominator + fraction.numerator * this.denominator,
            this.denominator * fraction.denominator
        );
    }

    public subtract(fraction: Fraction): Fraction {
        return new Fraction(
            this.numerator * fraction.denominator - fraction.numerator * this.denominator,
            this.denominator * fraction.denominator
        );
    }

    public multiply(fraction: Fraction): Fraction {
        return new Fraction(
            this.numerator * fraction.numerator,
            this.denominator * fraction.denominator
        );
    }

    public inverse(): Fraction {
        return new Fraction(this.denominator, this.numerator);
    }

    private greatestCommonDivisor(alpha: number, beta: number): number {
        return beta === 0 ? alpha : this.greatestCommonDivisor(beta, alpha % beta);
    }
}

function parseMachine(line: string): Machine {
    const joltageMatch: RegExpMatchArray | null = line.match(/\{([0-9,]+)\}/);
    if (!joltageMatch) throw new Error('Invalid joltage format');

    const joltageRequirements: number[] = joltageMatch[1].split(',').map(Number);
    const buttonMatches: IterableIterator<RegExpMatchArray> = line.matchAll(/\(([0-9,]+)\)/g);
    const buttons: number[][] = [];

    for (const match of buttonMatches) {
        const buttonIndices: number[] = match[1].split(',').map(Number);
        buttons.push(buttonIndices);
    }

    return { joltageRequirements, buttons };
}

function solveMinimumButtonPressesForJoltage(machine: Machine, machineIndex: number): number {
    const requirements: number[] = machine.joltageRequirements;
    const buttons: number[][] = machine.buttons;
    const numberOfRows: number = requirements.length;
    const numberOfColumns: number = buttons.length;

    const buttonUpperBounds: number[] = buttons.map((buttonIndices: number[]) => {
        if (buttonIndices.length === 0) return 0;

        let minimumRequirement: number = Infinity;

        for (const requirementIndex of buttonIndices) {
            if (requirements[requirementIndex] < minimumRequirement) {
                minimumRequirement = requirements[requirementIndex];
            }
        }

        return minimumRequirement;
    });

    const matrix: Fraction[][] = [];

    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    
        const row: Fraction[] = [];
    
        for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
            const coefficient: number = buttons[columnIndex].includes(rowIndex) ? 1 : 0;
            row.push(new Fraction(coefficient));
        }
    
        row.push(new Fraction(requirements[rowIndex]));
        matrix.push(row);
    }

    let pivotRowIndex: number = 0;
    const pivotColumnIndices: number[] = Array(numberOfRows).fill(-1);

    for (let columnIndex: number = 0; columnIndex < numberOfColumns && pivotRowIndex < numberOfRows; columnIndex++) {
        
        let selectionRowIndex: number = pivotRowIndex;
        
        while (selectionRowIndex < numberOfRows && matrix[selectionRowIndex][columnIndex].numerator === 0) {
            selectionRowIndex++;
        }

        if (selectionRowIndex === numberOfRows) continue;

        [matrix[pivotRowIndex], matrix[selectionRowIndex]] = [matrix[selectionRowIndex], matrix[pivotRowIndex]];
        pivotColumnIndices[pivotRowIndex] = columnIndex;

        const pivotInverse: Fraction = matrix[pivotRowIndex][columnIndex].inverse();
        
        for (let j: number = columnIndex; j <= numberOfColumns; j++) {
            matrix[pivotRowIndex][j] = matrix[pivotRowIndex][j].multiply(pivotInverse);
        }

        for (let i: number = 0; i < numberOfRows; i++) {
            if (i !== pivotRowIndex) {
                const factor: Fraction = matrix[i][columnIndex];

                for (let j: number = columnIndex; j <= numberOfColumns; j++) {
                    matrix[i][j] = matrix[i][j].subtract(factor.multiply(matrix[pivotRowIndex][j]));
                }
            }
        }
        
        pivotRowIndex++;
    }

    for (let i: number = pivotRowIndex; i < numberOfRows; i++) {
        if (matrix[i][numberOfColumns].numerator !== 0) {
            return -1;
        }
    }

    const freeVariableIndices: number[] = [];
    const usedColumnIndices: Set<number> = new Set<number>();

    for (let i: number = 0; i < pivotRowIndex; i++) {
        usedColumnIndices.add(pivotColumnIndices[i]);
    }

    for (let columnIndex: number = 0; columnIndex < numberOfColumns; columnIndex++) {
        if (!usedColumnIndices.has(columnIndex)) {
            freeVariableIndices.push(columnIndex);
        }
    }

    let minimumTotalPresses: number = Infinity;

    function solveForAssignment(freeVariableValues: number[]): void {
        const currentSolution: number[] = Array(numberOfColumns).fill(0);
        let currentTotalPresses: number = 0;

        for (let i: number = 0; i < freeVariableIndices.length; i++) {

            const freeColumnIndex: number = freeVariableIndices[i];
            const value: number = freeVariableValues[i];

            currentSolution[freeColumnIndex] = value;
            currentTotalPresses += value;
        }

        for (let i = pivotRowIndex - 1; i >= 0; i--) {
            const pivotColumnIndex: number = pivotColumnIndices[i];
            let value: Fraction = matrix[i][numberOfColumns];

            for (let f: number = 0; f < freeVariableIndices.length; f++) {

                const freeColumnIndex: number = freeVariableIndices[f];
                const coefficient: Fraction = matrix[i][freeColumnIndex];
                const freeValue: Fraction = new Fraction(freeVariableValues[f]);
                
                value = value.subtract(coefficient.multiply(freeValue));
            }

            if (value.denominator !== 1 || value.numerator < 0) return;

            currentSolution[pivotColumnIndex] = value.numerator;
            currentTotalPresses += value.numerator;
        }

        if (currentTotalPresses < minimumTotalPresses) {
            minimumTotalPresses = currentTotalPresses;
        }
    }

    if (freeVariableIndices.length === 0) {
        solveForAssignment([]);
    } else {
        const currentFreeVariableValues: number[] = Array(freeVariableIndices.length).fill(0);

        function executeBruteForceSearch(index: number): void {
            if (index === freeVariableIndices.length) {
                solveForAssignment(currentFreeVariableValues);
                return;
            }

            const variableIndex: number = freeVariableIndices[index];
            const upperLimit: number = buttonUpperBounds[variableIndex];

            for (let value: number = 0; value <= upperLimit; value++) {
                currentFreeVariableValues[index] = value;
                executeBruteForceSearch(index + 1);
            }
        }

        executeBruteForceSearch(0);
    }

    if (minimumTotalPresses === Infinity) {
        console.log(`Machine ${machineIndex}: No Integer Solution Found`);
        return -1;
    }

    console.log(`Machine ${machineIndex}: Solved with ${minimumTotalPresses} presses`);
    return minimumTotalPresses;
}

const inputFilePath: string = path.join(__dirname, 'input.txt');
let result: number = 0;

try {
    const content: string = fs.readFileSync(inputFilePath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    let machineCounter: number = 0;

    for (const line of lines) {
        if (line.trim().length === 0) continue;

        const currentMachine: Machine = parseMachine(line);
        const minimumPressesForMachine: number = solveMinimumButtonPressesForJoltage(currentMachine, machineCounter);
        
        machineCounter++;

        if (minimumPressesForMachine !== -1) {
            result += minimumPressesForMachine;
        }
    }

    console.log(result);

} catch (error) {
    console.error('Error reading file:', error);
}