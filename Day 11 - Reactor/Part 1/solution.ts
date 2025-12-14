import fs from 'fs';
import path from 'path';

class Graph {
    private adjacencyList: Map<string, Array<string>>;
 
    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex: string) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
 
    addEdge(v1: string, v2: string) {
        if (this.adjacencyList.has(v1) && this.adjacencyList.has(v2)) {
            this.adjacencyList.get(v1)?.push(v2);
        }
    }
 
    findAllPaths(start: string, end: string): Array<Array<string>> {
        const paths: Array<Array<string>> = [];
        const currentPath: Array<string> = [];
        
        const dfs = (node: string) => {
            currentPath.push(node);
            
            if (node === end) {
                paths.push([...currentPath]);
            } else {
                const neighbors = this.adjacencyList.get(node) || [];
                for (const neighbor of neighbors) {
                    dfs(neighbor);
                }
            }
            
            currentPath.pop();
        };
        
        dfs(start);
        return paths;
    }
} 

let result: number = 0;
const inputPath: string = path.join(__dirname, 'input.txt');

try {
    const content: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: Array<string> = content.trim().split(/\r?\n/);
    const graph: Graph = new Graph();
    graph.addVertex('out');

    lines.forEach((line: string) => {
        const [node, edges]: Array<string> = line.split(':');
        const nodeName: string = node.trim();
        graph.addVertex(nodeName);
        
        const adjacentNodes = edges.trim().split(' ');

        adjacentNodes.forEach((adjacentNode: string) => {
            const trimmedAdjacentNode: string = adjacentNode.trim();
            graph.addVertex(trimmedAdjacentNode);
            graph.addEdge(nodeName, trimmedAdjacentNode);
        });
    });

    result = graph.findAllPaths('you', 'out').length;
    console.log(result);

} catch (err) {
    console.error('Error reading file:', err);
}