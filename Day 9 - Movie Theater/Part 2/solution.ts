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

class Rectangle {
    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(left: number = 0, right: number = 0, top: number = 0, bottom: number = 0) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
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
        redTiles.push(new Tile(Number(coordinates[1]), Number(coordinates[0])));
    });

    for (let firstRedTileIndex: number = 0; firstRedTileIndex < redTiles.length - 1; firstRedTileIndex++) {
        for (let secondRedTileIndex: number = firstRedTileIndex + 1; secondRedTileIndex < redTiles.length; secondRedTileIndex++) {
            const firstCornerTile: Tile = redTiles[firstRedTileIndex];
            const secondCornerTile: Tile = redTiles[secondRedTileIndex];

            if (isRectangleValid(firstCornerTile, secondCornerTile, firstRedTileIndex, secondRedTileIndex, redTiles)) {
                const calculatedRectangleArea: number =
                    (Math.abs(firstCornerTile.x - secondCornerTile.x) + 1) *
                    (Math.abs(firstCornerTile.y - secondCornerTile.y) + 1);

                if (result < calculatedRectangleArea) {
                    result = calculatedRectangleArea;
                }
            }
        }
    }

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function isRectangleValid(firstCorner: Tile, secondCorner: Tile, firstCornerIndex: number, secondCornerIndex: number, redTiles: Array<Tile>): boolean {
    const givenRectangle: Rectangle = getRectangle(firstCorner, secondCorner);

    for (let i: number = 0; i < redTiles.length; i++) {
        let j: number = (i + 1) % redTiles.length;

        if (i === firstCornerIndex || i === secondCornerIndex || j === firstCornerIndex || j === secondCornerIndex) {
            continue;
        }

        const toBeEvaluatedRectangle: Rectangle = getRectangle(redTiles[i], redTiles[j]);

        if (
            givenRectangle.left < toBeEvaluatedRectangle.right &&
            givenRectangle.right > toBeEvaluatedRectangle.left &&
            givenRectangle.top < toBeEvaluatedRectangle.bottom &&
            givenRectangle.bottom > toBeEvaluatedRectangle.top
        ) {
            return false;
        }
    }

    return true;
}

function getRectangle(firstCorner: Tile, secondCorner: Tile): Rectangle {
    const rectangle = new Rectangle(firstCorner.x, secondCorner.x, firstCorner.y, secondCorner.y);

    if (rectangle.right < rectangle.left) {
        rectangle.left = secondCorner.x;
        rectangle.right = firstCorner.x;
    }

    if (rectangle.bottom < rectangle.top) {
        rectangle.top = secondCorner.y;
        rectangle.bottom = firstCorner.y;
    }

    return rectangle;
}