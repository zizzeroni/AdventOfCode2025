import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const banks: string[] = content.split(/\r?\n/);

    banks.forEach((bank: string) => {
        result += Number(findJoltage(bank, 12));
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function findJoltage(bank: string, neededBatteries: number, start: number = 0): string {
    const memoization = new Map<string, string>();
    
    function dynamicProgramming(startIndex: number, remainingBatteries: number): string {
        if (remainingBatteries === bank.length - startIndex) {
            return bank.slice(startIndex);
        }
        
        if (remainingBatteries === 0) {
            return '';
        }
        
        const memoizationKey = `${startIndex},${remainingBatteries}`;
        
        if (memoization.has(memoizationKey)) {
            return memoization.get(memoizationKey)!;
        }
        
        const joltageWithCurrentBattery = bank[startIndex] + dynamicProgramming(startIndex + 1, remainingBatteries - 1);
        
        const joltageWithoutCurrentBattery = dynamicProgramming(startIndex + 1, remainingBatteries);
        
        const bestJoltage = joltageWithCurrentBattery > joltageWithoutCurrentBattery ? joltageWithCurrentBattery : joltageWithoutCurrentBattery;
        memoization.set(memoizationKey, bestJoltage);

        return bestJoltage;
    }
    
    return dynamicProgramming(0, neededBatteries);
}


