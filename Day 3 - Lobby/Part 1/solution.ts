import fs from 'fs';
import path from 'path';

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const banks: string[] = content.split(/\r?\n/);

    banks.forEach((bank: string) => {
        result += findJoltage(bank, 9, true);
    });

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function findJoltage(bank: string, maximumValue: number, isFirstBattery: boolean): number {
    const maximumValueIndex = bank.indexOf(maximumValue.toString());
    if(maximumValueIndex == -1) {
        return findJoltage(bank, --maximumValue, isFirstBattery);
    }

    if(!isFirstBattery) {
        return Number(bank[maximumValueIndex]);
    }
    
    if(maximumValueIndex === bank.length - 1) {
        return findJoltage(bank, --maximumValue, isFirstBattery);
    }

    return findJoltage(bank.substring(maximumValueIndex + 1), 9, false) + (Number(bank[maximumValueIndex]) * 10);
}