import fs from 'fs';
import path from 'path';

let result: number = 0;
let dialIndex: number = 50;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.split(/\r?\n/);

    lines.forEach((line: string) => {
        const direction = line.substring(0,1);
        const distance = line.substring(1);

        if(direction === 'L') {
            dialIndex -= Number(distance) % 100;
            if(dialIndex < 0) {
                dialIndex = dialIndex + 100;
            }
        } else {
            dialIndex += Number(distance) % 100;

            if(dialIndex >= 100) {
                dialIndex -= 100;
            }
        }

        if(dialIndex === 0) {
            result++;
        }
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}


