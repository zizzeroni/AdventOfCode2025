import fs from 'fs';
import path from 'path';

class JunctionBox {
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;

    }
}

class Edge {
    junctionBoxIndex1: number;
    junctionBoxIndex2: number;
    distance: number;

    constructor(junctionBoxIndex1: number = 0, junctionBoxIndex2: number = 0, distance: number = 0) {
        this.junctionBoxIndex1 = junctionBoxIndex1;
        this.junctionBoxIndex2 = junctionBoxIndex2;
        this.distance = distance;
    }
}

class UnionFind {
    parent: number[];
    circuitSize: number[];

    constructor(numberOfJunctionBoxes: number) {
        this.parent = Array.from({ length: numberOfJunctionBoxes }, (junctionBox: JunctionBox, junctionBoxIndex: number) => junctionBoxIndex);
        this.circuitSize = Array(numberOfJunctionBoxes).fill(1);
    }

    find(junctionBoxIndex: number): number {
        if (this.parent[junctionBoxIndex] !== junctionBoxIndex) {
            this.parent[junctionBoxIndex] = this.find(this.parent[junctionBoxIndex]);
        }
        return this.parent[junctionBoxIndex];
    }

    union(junctionBoxIndex1: number, junctionBoxIndex2: number): boolean {
        const root1: number = this.find(junctionBoxIndex1);
        const root2: number = this.find(junctionBoxIndex2);

        if (root1 === root2) {
            return false;
        }

        if (this.circuitSize[root1] < this.circuitSize[root2]) {
            this.parent[root1] = root2;
            this.circuitSize[root2] += this.circuitSize[root1];
        } else {
            this.parent[root2] = root1;
            this.circuitSize[root1] += this.circuitSize[root2];
        }

        return true;
    }

    getCircuitSizes(): number[] {
        const circuitSizes: Map<number, number> = new Map<number, number>();
        
        for (let i: number = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            circuitSizes.set(root, this.circuitSize[root]);
        }
        
        return Array.from(circuitSizes.values());
    }
}

let result: number = 0;
const inputPath = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: string[] = content.trim().split(/\r?\n/);
    const junctionBoxes: Array<JunctionBox> = [];

    lines.forEach((line: string) => {
        const coordinates: string[] = line.split(',');
        junctionBoxes.push(new JunctionBox(Number(coordinates[0]), Number(coordinates[1]), Number(coordinates[2])));
    });

    const allEdges: Edge[] = [];
    for (let i: number = 0; i < junctionBoxes.length; i++) {
        for (let j: number = i + 1; j < junctionBoxes.length; j++) {
            const distance = evaluateJunctionBoxDistance(junctionBoxes[i], junctionBoxes[j]);
            allEdges.push(new Edge(i, j, distance));
        }
    }

    allEdges.sort((edge1: Edge, edge2: Edge) => edge1.distance - edge2.distance);

    const unionFind: UnionFind = new UnionFind(junctionBoxes.length);
    const maxPairsToProcess: number = 1000;
    let pairsProcessed: number = 0;

    for (const edge of allEdges) {
        if (pairsProcessed >= maxPairsToProcess) {
            break;
        }

        unionFind.union(edge.junctionBoxIndex1, edge.junctionBoxIndex2);
        pairsProcessed++;
    }

    const circuitSizes = unionFind.getCircuitSizes();
    circuitSizes.sort((a: number, b: number) => b - a);

    const threeLargestCircuits = circuitSizes.slice(0, 3);
    result = threeLargestCircuits.reduce((product: number, size: number) => product * size, 1);
    
    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}

function evaluateJunctionBoxDistance(junctionBox1: JunctionBox, junctionBox2: JunctionBox): number {
    return Math.sqrt(
        Math.pow((junctionBox1.x - junctionBox2.x), 2) + 
        Math.pow((junctionBox1.y - junctionBox2.y), 2) + 
        Math.pow((junctionBox1.z - junctionBox2.z), 2)
    );
}