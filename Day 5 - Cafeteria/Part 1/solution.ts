import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    
    const separatorIndex: number = lines.findIndex((line: string) => line.trim() === '');
    const rangeLines: string[] = lines.slice(0, separatorIndex);
    const ingredientLines: string[] = lines.slice(separatorIndex + 1);
    
    const freshRanges: Array<[number, number]> = rangeLines.map((line: string) => {
        const [start, end]: Array<number> = line.split('-').map(Number);
        return [start, end];
    });
    
    const sortedRanges: Array<[number, number]> = freshRanges.sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
    
    const mergedRanges: Array<[number, number]> = [];
    let currentRange: [number, number] = sortedRanges[0];
    
    for (let i: number = 1; i < sortedRanges.length; i++) {
        const [nextStart, nextEnd] = sortedRanges[i];
        
        if (nextStart <= currentRange[1] + 1) {
            currentRange[1] = Math.max(currentRange[1], nextEnd);
        } else {
            mergedRanges.push(currentRange);
            currentRange = [nextStart, nextEnd];
        }
    }
    mergedRanges.push(currentRange);
    
    const ingredientIds: number[] = ingredientLines.map(Number);
    
    result = ingredientIds.filter(ingredientId => {
        let left: number = 0;
        let right: number = mergedRanges.length - 1;
        
        while (left <= right) {
            const mid: number = Math.floor((left + right) / 2);
            const [rangeStart, rangeEnd] = mergedRanges[mid];
            
            if (ingredientId >= rangeStart && ingredientId <= rangeEnd) {
                return true;
            } else if (ingredientId < rangeStart) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        return false;
    }).length;
    
    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}