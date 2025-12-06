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
        const distance = Number(line.substring(1));
        let _dialIndex = dialIndex; 

        if(direction === 'L') {
            dialIndex -= distance % 100;

            if(dialIndex < 0) {
                dialIndex = dialIndex + 100;
                
                if(_dialIndex != 0) {
                    result++;
                }
            }
               
            if(dialIndex === 0 && _dialIndex != 0) {
                result++;
            }
        } else {
            dialIndex += distance % 100;

            if(dialIndex >= 100) {
                dialIndex -= 100;
                result++;
            }
        }

        result += Math.floor(distance / 100);
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}


