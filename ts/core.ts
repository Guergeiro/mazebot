const apiUrl = `https://api.noopschallenge.com/mazebot`;
let visitedPos: Array<Array<number>> = [];

/*
 * Async func that gets the maze
 * @param type: contains String that will be appended to main endpoint
 * @return: JSON data with the maze
 */
const getMaze = async (type: String) => {
    const response = await fetch(`${apiUrl}/${type}`);
    const data = await response.json();
    return data;
}

/*
 * Calculates direct cost between any given node and endingPosition
 * @param node: contains array with any node
 * @param endPos: contains array with the endingPosition node
 * @return: float value of direct cost
 */
const calculateDirectCost = (node: Array<number>, endPos: Array<number>) => {
    let cat1: number = Math.abs(endPos[0] - node[0]);
    let cat2: number = Math.abs(endPos[1] - node[1]);
    return Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));
}

/*
 * Compares two nodes
 * @param node1: contains array which is position of first node
 * @param node2: contains array which is position of second node
 * @return: true if same position, false otherwise
 */
const compareNodes = (node1: Array<number>, node2: Array<number>) => {
    return (node1[0] == node2[0]) && (node1[1] == node2[1]);
}

/*
 * Checks if a given node was already visited
 * @param node: contains array with position of node we want to check
 * @return: true if node was already visited, false otherwise
 */
const checkNodeVisited = (node: Array<number>) => {
    for (const visited of visitedPos) {
        if (compareNodes(visited, node)) {
            return true;
        }
    }
}

const openNode = (currentPos: Array<number>, endPos: Array<number>) => {
    if (compareNodes(currentPos, endPos)) {
        // Path found
        return true;
    }
    // Check N
    if (currentPos[1] > 0) {
        if (openNode([currentPos[0], currentPos[1] - 1], endPos)) {
            // Found solution

        }
    }
    // Check W
    if (currentPos[0] > 1) {
        if (openNode([currentPos[0] - 1, currentPos[1]], endPos)) {
            // Found solution
        }
    }
    // Check S
    if (currentPos[1] < 1) {
        if (openNode([currentPos[0], currentPos[1] + 1], endPos)) {
            // Found solution
        }
    }
    // Check E
    if (currentPos[0] < 1) {
        if (openNode([currentPos[0] + 1, currentPos[1]], endPos)) {
            // Found solution
        }
    }

    // No solutions
    return false;
}

const init = async () => {
    const data = await getMaze(`random`);
    console.log(data);
    console.log(calculateDirectCost(data[`startingPosition`], data[`endingPosition`]));
}
