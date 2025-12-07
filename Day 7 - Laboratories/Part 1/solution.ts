import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    let beamIndexes: Array<number> = [lines[0].indexOf('S')];

    lines.forEach((line: string) => {
        let obstacleIndexes: Array<number> = [];
        let obstacleIndex: number = line.indexOf('^');

        while (obstacleIndex != -1) {
            obstacleIndexes.push(obstacleIndex);
            obstacleIndex = line.indexOf('^', obstacleIndex + 1);
        }
        
        let commonIndexes: Array<number> = obstacleIndexes.filter((obstacle: number) => beamIndexes.includes(obstacle));
        beamIndexes = beamIndexes.filter((beamIndex: number) => !commonIndexes.includes(beamIndex));

        commonIndexes.forEach((commonIndex: number) => {
            beamIndexes.push(commonIndex - 1, commonIndex + 1);
            result++;
        })
        
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}