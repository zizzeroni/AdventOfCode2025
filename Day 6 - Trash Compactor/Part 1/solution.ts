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
    
    for (let column = 0; column < maxLength; column++) {
        let hasContent: boolean = false;
        for (let row: number = 0; row < lines.length; row++) {
            if (column < lines[row].length && lines[row][column] !== ' ') {
                hasContent = true;
                break;
            }
        }
        
        if (hasContent && !inProblem) {
            problemStart = column;
            inProblem = true;
        } else if (!hasContent && inProblem) {
            const numbers: number[] = [];
            let operator: string = '';
            
            for (let row: number = 0; row < lines.length; row++) {
                const segment: string = lines[row].substring(problemStart, column).trim();
                if (segment === '+' || segment === '*') {
                    operator = segment;
                } else if (segment && segment.match(/^\d+$/)) {
                    numbers.push(parseInt(segment));
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
    
    if (inProblem) {
        const numbers: number[] = [];
        let operator: string = '';
        
        for (let row: number = 0; row < lines.length; row++) {
            const segment: string = lines[row].substring(problemStart).trim();
            if (segment === '+' || segment === '*') {
                operator = segment;
            } else if (segment && segment.match(/^\d+$/)) {
                numbers.push(parseInt(segment));
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
    }

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}