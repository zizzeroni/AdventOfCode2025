import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
        
    const maxLength = Math.max(...lines.map((line: string) => line.length));
    
    let inProblem: boolean = false;
    let problemStart: number = -1;
    let problemEnd: number = -1;
    
    for (let column = maxLength - 1; column >= -1; column--) {
        let hasContent: boolean = false;
        if (column >= 0) {
            for (let row: number = 0; row < lines.length; row++) {
                if (column < lines[row].length && lines[row][column] !== ' ') {
                    hasContent = true;
                    break;
                }
            }
        }
        
        if (hasContent && !inProblem) {
            problemEnd = column;
            inProblem = true;
        } else if ((!hasContent || column === -1) && inProblem) {
            problemStart = column + 1;
            
            const numbers: number[] = [];
            let operator: string = '';
            
            for (let col: number = problemStart; col <= problemEnd; col++) {
                if (col < lines[lines.length - 1].length) {
                    const char = lines[lines.length - 1][col];
                    if (char === '+' || char === '*') {
                        operator = char;
                        break;
                    }
                }
            }
            
            for (let col: number = problemStart; col <= problemEnd; col++) {
                let columnStr: string = '';
                
                for (let row: number = 0; row < lines.length - 1; row++) {
                    if (col < lines[row].length) {
                        const char = lines[row][col];
                        if (char !== ' ') {
                            columnStr += char;
                        }
                    }
                }
                
                if (columnStr && columnStr.match(/^\d+$/)) {
                    numbers.push(parseInt(columnStr));
                }
            }
            
            if (numbers.length > 0 && operator) {
                let problemResult: number = numbers[0];
                for (let i: number = 1; i < numbers.length; i++) {
                    if (operator === '+') {
                        problemResult += numbers[i];
                    } else if (operator === '*') {
                        problemResult *= numbers[i];
                    }
                }
                result += problemResult;
            }
            
            inProblem = false;
        }
    }

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}