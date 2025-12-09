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
const inputPath: string = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    const redTiles: Array<Tile> = [];

    lines.forEach((currentLine: string) => {
        const coordinates: string[] = currentLine.split(',');
        redTiles.push(new Tile(Number(coordinates[0]), Number(coordinates[1])));
    });

    const validTilesSet = new Set<string>();
    
    for (let redTileIndex: number = 0; redTileIndex < redTiles.length; redTileIndex++) {
        const currentRedTile: Tile = redTiles[redTileIndex];
        const nextRedTile: Tile = redTiles[(redTileIndex + 1) % redTiles.length];
        
        if (currentRedTile.x === nextRedTile.x) {
            const minimumYCoordinate: number = Math.min(currentRedTile.y, nextRedTile.y);
            const maximumYCoordinate: number = Math.max(currentRedTile.y, nextRedTile.y);
            for (let yCoordinate: number = minimumYCoordinate; yCoordinate <= maximumYCoordinate; yCoordinate++) {
                validTilesSet.add(`${currentRedTile.x},${yCoordinate}`);
            }
        } else {
            const minimumXCoordinate: number = Math.min(currentRedTile.x, nextRedTile.x);
            const maximumXCoordinate: number = Math.max(currentRedTile.x, nextRedTile.x);
            for (let xCoordinate: number = minimumXCoordinate; xCoordinate <= maximumXCoordinate; xCoordinate++) {
                validTilesSet.add(`${xCoordinate},${currentRedTile.y}`);
            }
        }
    }
    
    const pathTilesList: Array<Tile> = Array.from(validTilesSet).map((tileString: string) => {
        const [xValue, yValue]: number[] = tileString.split(',').map(Number);
        return new Tile(xValue, yValue);
    });
    
    const minimumXBoundary: number = Math.min(...pathTilesList.map((tile: Tile) => tile.x));
    const maximumXBoundary: number = Math.max(...pathTilesList.map((tile: Tile) => tile.x));
    const minimumYBoundary: number = Math.min(...pathTilesList.map((tile: Tile) => tile.y));
    const maximumYBoundary: number = Math.max(...pathTilesList.map((tile: Tile) => tile.y));
    
    for (let yPosition: number = minimumYBoundary; yPosition <= maximumYBoundary; yPosition++) {
        for (let xPosition: number = minimumXBoundary; xPosition <= maximumXBoundary; xPosition++) {
            if (isInsideLoop(xPosition, yPosition, redTiles)) {
                validTilesSet.add(`${xPosition},${yPosition}`);
            }
        }
    }

    for (let firstRedTileIndex: number = 0; firstRedTileIndex < redTiles.length; firstRedTileIndex++) {
        for (let secondRedTileIndex: number = firstRedTileIndex + 1; secondRedTileIndex < redTiles.length; secondRedTileIndex++) {
            const calculatedRectangleArea: number = evaluateTilesArea(redTiles[firstRedTileIndex], redTiles[secondRedTileIndex], validTilesSet);
            
            if(result < calculatedRectangleArea) {
                result = calculatedRectangleArea;
            }
        }
    }

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}


function evaluateTilesArea(firstCornerTile: Tile, secondCornerTile: Tile, validTilesSet: Set<string>): number {
    const rectangleMinimumX: number = Math.min(firstCornerTile.x, secondCornerTile.x);
    const rectangleMaximumX: number = Math.max(firstCornerTile.x, secondCornerTile.x);
    const rectangleMinimumY: number = Math.min(firstCornerTile.y, secondCornerTile.y);
    const rectangleMaximumY: number = Math.max(firstCornerTile.y, secondCornerTile.y);
    
    for (let yCoordinateToCheck: number = rectangleMinimumY; yCoordinateToCheck <= rectangleMaximumY; yCoordinateToCheck++) {
        for (let xCoordinateToCheck: number = rectangleMinimumX; xCoordinateToCheck <= rectangleMaximumX; xCoordinateToCheck++) {
            if (!validTilesSet.has(`${xCoordinateToCheck},${yCoordinateToCheck}`)) {
                return 0;
            }
        }
    }
    
    return (Math.abs(firstCornerTile.x - secondCornerTile.x) + 1) * (Math.abs(firstCornerTile.y - secondCornerTile.y) + 1);
}

function isInsideLoop(xCoordinateToTest: number, yCoordinateToTest: number, redTiles: Array<Tile>): boolean {
    let intersectionCount: number = 0;
    
    for (let redTileSegmentIndex: number = 0; redTileSegmentIndex < redTiles.length; redTileSegmentIndex++) {
        const currentSegmentTile: Tile = redTiles[redTileSegmentIndex];
        const nextSegmentTile: Tile = redTiles[(redTileSegmentIndex + 1) % redTiles.length];
        
        if (currentSegmentTile.x === nextSegmentTile.x) {
            const segmentMinimumY: number = Math.min(currentSegmentTile.y, nextSegmentTile.y);
            const segmentMaximumY: number = Math.max(currentSegmentTile.y, nextSegmentTile.y);
            if (currentSegmentTile.x > xCoordinateToTest && yCoordinateToTest >= segmentMinimumY && yCoordinateToTest < segmentMaximumY) {
                intersectionCount++;
            }
        }
    }
    
    return intersectionCount % 2 === 1;
}