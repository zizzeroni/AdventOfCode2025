import fs from 'fs';
import path from 'path';

class Graph {
    private adjacencyList: Map<string, Array<string>>;
 
    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex: string): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
 
    addEdge(v1: string, v2: string) {
        if (this.adjacencyList.has(v1) && this.adjacencyList.has(v2)) {
            this.adjacencyList.get(v1)?.push(v2);
        }
    }
 
    countAllPaths(startNode: string, endNode: string): bigint {
        const memoization: Map<string, bigint> = new Map();
        
        const dfs = (currentNode: string): bigint => {
            if (currentNode === endNode) {
                return 1n;
            }
            
            if (memoization.has(currentNode)) {
                return memoization.get(currentNode)!;
            }
            
            let totalPaths: bigint = 0n;
            const neighbors: Array<string> = this.adjacencyList.get(currentNode) || [];
            for (const neighbor of neighbors) {
                totalPaths += dfs(neighbor);
            }
            
            memoization.set(currentNode, totalPaths);
            return totalPaths;
        };
        
        return dfs(startNode);
    }
    
    countPathsThroughBothNodes(startNode: string, endNode: string, firstRequiredNode: string, secondRequiredNode: string): bigint {
        // Case 1
        const pathsToFirstNode: bigint = this.countAllPaths(startNode, firstRequiredNode);
        const pathsBetweenNodes: bigint = this.countAllPaths(firstRequiredNode, secondRequiredNode);
        const pathsFromSecondNode: bigint = this.countAllPaths(secondRequiredNode, endNode);
        const firstCase: bigint = pathsToFirstNode * pathsBetweenNodes * pathsFromSecondNode;
        
        // Case 2
        const pathsToSecondNode: bigint = this.countAllPaths(startNode, secondRequiredNode);
        const pathsBetweenNodesReversed: bigint = this.countAllPaths(secondRequiredNode, firstRequiredNode);
        const pathsFromFirstNode: bigint = this.countAllPaths(firstRequiredNode, endNode);
        const secondCase: bigint = pathsToSecondNode * pathsBetweenNodesReversed * pathsFromFirstNode;
        
        return firstCase + secondCase;
    }
}

const inputPath: string = path.join(__dirname, 'input.txt');

try {
    const fileContent: string = fs.readFileSync(inputPath, 'utf-8');
    const lines: Array<string> = fileContent.trim().split(/\r?\n/);
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
    
    const result: bigint = graph.countPathsThroughBothNodes('svr', 'out', 'fft', 'dac');
    console.log(result);

} catch (error) {
    console.error('Error reading file:', error);
}