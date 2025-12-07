import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    let beamMap = new Map<number, number>();
    beamMap.set(lines[0].indexOf('S'), 1);

    lines.forEach((line: string) => {
        let obstacleIndexes: Array<number> = [];
        let obstacleIndex: number = line.indexOf('^');

        while (obstacleIndex != -1) {
            obstacleIndexes.push(obstacleIndex);
            obstacleIndex = line.indexOf('^', obstacleIndex + 1);
        }

        let newBeamMap = new Map<number, number>();

        beamMap.forEach((count: number, position: number) => {
            if (obstacleIndexes.includes(position)) {
                newBeamMap.set(position - 1, (newBeamMap.get(position - 1) || 0) + count);
                newBeamMap.set(position + 1, (newBeamMap.get(position + 1) || 0) + count);
            } else {
                newBeamMap.set(position, (newBeamMap.get(position) || 0) + count);
            }
        });
        
        beamMap = newBeamMap;
    });

    beamMap.forEach((count: number) => {
        result += count;
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}