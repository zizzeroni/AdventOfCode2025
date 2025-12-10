import fs from 'fs';
import path from 'path';

class Tile {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;

    }
}

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    const redTiles: Array<Tile> = [];

    lines.forEach((line: string) => {
        const coordinates: string[] = line.split(',');
        redTiles.push(new Tile(Number(coordinates[1]), Number(coordinates[0])));
    });

    for (let i: number = 0; i < redTiles.length; i++) {
        for (let j: number = i + 1; j < redTiles.length; j++) {
            const area = evaluateTilesArea(redTiles[i], redTiles[j]);
            
            if(result < area) {
                result = area;
            }
        }
    }

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}


function evaluateTilesArea(firstCornerTile: Tile, secondCornerTile: Tile): number {
    return (Math.abs(firstCornerTile.x - secondCornerTile.x) + 1) * (Math.abs(firstCornerTile.y - secondCornerTile.y) + 1);
}