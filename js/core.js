const apiUrl = `https://api.noopschallenge.com/mazebot`;
let map, ylength, xlength;
/*
 * Async func that gets the maze
 * @param type: contains string that will be appended to main endpoint
 * @return: JSON data with the maze
 */
const getMaze = async (type) => {
    const response = await fetch(`${apiUrl}/${type}`);
    const data = await response.json();
    return data;
};
/*
 * Async funct that posts the solution to the maze
 * @param mazeUrl: contains string with maze url
 * @param solution: contains string with the maze solution
 * @return: true if solution correct, false otherwise
 */
const postMaze = async (mazeUrl, solution) => {
    let formData = new FormData();
    formData.append(`solution`, solution);
    const response = await fetch(`${apiUrl}/${mazeUrl}`, {
        method: "POST",
        body: formData
    });
    if (response.status != 200) {
        // Wrong solution
        return false;
    }
    return true;
};
/*
 * Calculates direct cost between any given node and endingPosition
 * @param node: contains array with any node
 * @param endPos: contains array with the endingPosition node
 * @return: float value of direct cost
 */
const calculateDirectCost = (node, endPos) => {
    let cat1 = Math.abs(endPos[0] - node[0]);
    let cat2 = Math.abs(endPos[1] - node[1]);
    return Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));
};
/*
 * Compares two nodes
 * @param node1: contains array which is position of first node
 * @param node2: contains array which is position of second node
 * @return: true if same position, false otherwise
 */
const compareNodes = (node1, node2) => {
    return (node1[0] == node2[0]) && (node1[1] == node2[1]);
};
/*
 * Checks if a given node is available
 * @param node: contains array with position of node we want to check
 * @return: true if possible, false otherwise
 */
const checkNode = (node) => {
    if (map[node[0]][node[1]] == "X") {
        return false;
    }
    if (map[node[0]][node[1]] == "Visited") {
        return false;
    }
    return true;
};
/*
 * Opens a given node
 */
const openNode = (currentPos, endPos, solution) => {
    if (compareNodes(currentPos, endPos)) {
        // Path found
        return true;
    }
    // Check N bounds
    if (currentPos[1] > 0) {
        if (checkNode([currentPos[0], currentPos[1] - 1])) {
            // Node is possible
        }
    }
    // Check W bounds
    if (currentPos[0] > 0) {
        if (checkNode([currentPos[0] - 1, currentPos[1]])) {
            // Node is possible
        }
    }
    // Check S bounds
    if (currentPos[1] < ylength - 1) {
        if (checkNode([currentPos[0], currentPos[1] + 1])) {
            // Node is possible
        }
    }
    // Check E bounds
    if (currentPos[0] < xlength - 1) {
        if (checkNode([currentPos[0] + 1, currentPos[1]])) {
            // Node is possible
        }
    }
    // No solutions
    return false;
};
const init = async () => {
    const data = await getMaze(`random`);
    map = data[`map`];
    ylength = map.length;
    xlength = map[0].length;
    console.log(checkNode(data[`startingPosition`]));
    console.log(calculateDirectCost(data[`startingPosition`], data[`endingPosition`]));
};
