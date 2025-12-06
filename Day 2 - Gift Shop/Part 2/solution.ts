import fs from 'fs';
import path from 'path';

let result: number = 0;
const regex: RegExp = new RegExp(/^(.+)\1+$/); 
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const ranges: string[] = content.split(',');

    ranges.forEach((range: string) => {
        const [start, end]: Array<string> = range.split('-');
        const endOfRange = Number(end);
        let index = Number(start);

        if(index < 10) {
            index = 11;
        }
        
        while(index <= endOfRange) {
            if(regex.test(index.toString())) {
                result += index;
            }
            index++;
        }
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}
