import fs from 'fs';
import path from 'path';

type Shape = Array<Array<string>>;

class Region {
    width: number;
    height: number;
    presents: Array<number>;

    constructor(width: number = 0, height: number = 0, presents: Array<number> = []) {
        this.width = width;
        this.height = height;
        this.presents = presents;
    }
}

let result: number = 0;
const inputPath: string = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: Array<string> = content.trim().split(/\r?\n/);
    const shapes: Array<Shape> = [];
    const regions: Array<Region> = [];
    let isReadingShapes: boolean = true;
    let shapeIndex: number = 0;

    lines.forEach((currentLine: string) => {
        if(isReadingShapes) {
            if(currentLine.indexOf('x') === -1) {
                if(currentLine.indexOf(':') !== -1) {
                    shapeIndex = Number(currentLine.split(':')[0]);
                    shapes.push([]);
                } else if (currentLine.length){
                    shapes[shapeIndex].push(currentLine.split(''));
                }
            } else {
                isReadingShapes = false;

                const region = new Region();
                const splittedCurrentLine: Array<string> = currentLine.split('x');

                region.width = Number(splittedCurrentLine[0]);
                region.height = Number(splittedCurrentLine[1].split(':')[0]);
                region.presents = splittedCurrentLine[1].split(':')[1].trim().split(' ').map((present: string) => Number(present));
                
                regions.push(region);
            }
        } else {
            const region = new Region();
            const splittedCurrentLine: Array<string> = currentLine.split('x');
            
            region.width = Number(splittedCurrentLine[0]);
            region.height = Number(splittedCurrentLine[1].split(':')[0]);
            region.presents = splittedCurrentLine[1].split(':')[1].trim().split(' ').map((present: string) => Number(present));
            
            regions.push(region);
        }
    });

    result = countRegionsThatCanFitShapes(regions, shapes);

    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function rotateShape(shape: Shape): Shape {
    const rows: number = shape.length;
    const columns: number = shape[0].length;
    const rotated: Shape = [];

    for (let column: number = 0; column < columns; column++) {
        const newRow: string[] = [];
        for (let row: number = rows - 1; row >= 0; row--) {
            newRow.push(shape[row][column]);
        }
        rotated.push(newRow);
    }

    return rotated;
}

function flipShape(shape: Shape): Shape {
    return shape.map((row: Array<string>) => row.reverse());
}

function shapeToString(shape: Shape): string {
    return shape.map(row => row.join('')).join('|');
}

function getAllOrientations(shape: Shape): Shape[] {
    const orientations: Shape[] = [];
    const seen = new Set<string>();
    let current: Shape = shape;

    for (let i: number = 0; i < 4; i++) {
        const key = shapeToString(current);
        if (!seen.has(key)) {
            orientations.push(current);
            seen.add(key);
        }
        current = rotateShape(current);
    }

    current = flipShape(shape);
    for (let i: number = 0; i < 4; i++) {
        const key = shapeToString(current);
        if (!seen.has(key)) {
            orientations.push(current);
            seen.add(key);
        }
        current = rotateShape(current);
    }

    return orientations;
}

function getShapeArea(shape: Shape): number {
    let area: number = 0;
    for (const row of shape) {
        for (const cell of row) {
            if (cell === '#') area++;
        }
    }
    return area;
}

function canFitShapesInRegion(region: Region, shapes: Array<Shape>): boolean {
    const totalArea = region.width * region.height;
    let requiredArea = 0;
    
    for (let i = 0; i < region.presents.length; i++) {
        requiredArea += region.presents[i] * getShapeArea(shapes[i]);
    }
    
    if (requiredArea > totalArea) {
        return false;
    }
    
    const grid: number[][] = Array.from({ length: region.height }, () => Array(region.width).fill(0));
    const presentsToPlace: { orientations: Shape[], id: number }[] = [];

    let presentId: number = 1;
    
    for (let i: number = 0; i < region.presents.length; i++) {
        const presentCount: number = region.presents[i];
        const orientations: Array<Shape> = getAllOrientations(shapes[i]);
        
        for (let count: number = 0; count < presentCount; count++) {
            presentsToPlace.push({ orientations, id: presentId++ });
        }
    }

    return backtrack(grid, presentsToPlace, 0);
}

function backtrack(grid: number[][], presentsToPlace: { orientations: Shape[], id: number }[], index: number): boolean {
    if (index === presentsToPlace.length) {
        return true;
    }

    const { orientations, id } = presentsToPlace[index];

    for (const orientation of orientations) {
        const shapeHeight = orientation.length;
        const shapeWidth = orientation[0].length;

        for (let row: number = 0; row <= grid.length - shapeHeight; row++) {
            for (let col = 0; col <= grid[0].length - shapeWidth; col++) {
                if (canPlaceAt(grid, row, col, orientation)) {
                    placeAt(grid, row, col, orientation, id);
                    
                    if (backtrack(grid, presentsToPlace, index + 1)) {
                        return true;
                    }
                    
                    removeAt(grid, row, col, orientation);
                }
            }
        }
    }

    return false;
}

function canPlaceAt(grid: number[][], row: number, col: number, shape: Shape): boolean {
    for (let i: number = 0; i < shape.length; i++) {
        for (let j: number = 0; j < shape[i].length; j++) {
            if (shape[i][j] === '#' && grid[row + i][col + j] !== 0) {
                return false;
            }
        }
    }

    return true;
}

function placeAt(grid: number[][], row: number, col: number, shape: Shape, id: number): void {
    for (let i: number = 0; i < shape.length; i++) {
        for (let j: number = 0; j < shape[i].length; j++) {
            if (shape[i][j] === '#') {
                grid[row + i][col + j] = id;
            }
        }
    }
}

function removeAt(grid: number[][], row: number, col: number, shape: Shape): void {
    for (let i: number = 0; i < shape.length; i++) {
        for (let j: number = 0; j < shape[i].length; j++) {
            if (shape[i][j] === '#') {
                grid[row + i][col + j] = 0;
            }
        }
    }
}

function countRegionsThatCanFitShapes(regions: Array<Region>, shapes: Array<Shape>): number {
    let count: number = 0;

    for (let i: number = 0; i < regions.length; i++) {
        if (canFitShapesInRegion(regions[i], shapes)) {
            count++;
        }
    }

    return count;
}