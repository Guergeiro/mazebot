const apiUrl = `https://api.noopschallenge.com/mazebot`;
let map;
let starPos;
let endPos;
let ylength;
let xlength;
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
    let json = { "directions": solution };
    const response = await fetch(`${apiUrl}/${mazeUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json)
    });
    const data = await response.json();
    console.log(data);
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
 * Checks if a given node is available, X means wall, 0 means already visited position
 * @param node: contains array with position of node we want to check
 * @return: true if possible, false otherwise
 */
const checkNode = (node) => {
    if (map[node[1]][node[0]] == "X") {
        return false;
    }
    if (map[node[1]][node[0]] == "0") {
        return false;
    }
    return true;
};
/*
 * Opens a given node and tries to solve it recursively
 * @param currentPos: contains array with the position of the current node
 * @return: true if solution found, false otherwise
 */
const openNode = (currentPos) => {
    map[currentPos[1]][currentPos[0]] = "0";
    if (compareNodes(currentPos, endPos)) {
        // Path found
        map[currentPos[1]][currentPos[0]] = "1";
        return true;
    }
    // Check N bounds
    if (currentPos[1] > 0) {
        if (checkNode([currentPos[0], currentPos[1] - 1])) {
            // Node is possible
            if (openNode([currentPos[0], currentPos[1] - 1])) {
                // Solution Possible
                map[currentPos[1]][currentPos[0]] = "1";
                return true;
            }
            // Not Possible
        }
    }
    // Check W bounds
    if (currentPos[0] > 0) {
        if (checkNode([currentPos[0] - 1, currentPos[1]])) {
            // Node is possible
            if (openNode([currentPos[0] - 1, currentPos[1]])) {
                // Solution Possible
                map[currentPos[1]][currentPos[0]] = "1";
                return true;
            }
            // Not Possible
        }
    }
    // Check S bounds
    if (currentPos[1] < ylength - 1) {
        if (checkNode([currentPos[0], currentPos[1] + 1])) {
            // Node is possible
            if (openNode([currentPos[0], currentPos[1] + 1])) {
                // Solution Possible
                map[currentPos[1]][currentPos[0]] = "1";
                return true;
            }
            // Not Possible
        }
    }
    // Check E bounds
    if (currentPos[0] < xlength - 1) {
        if (checkNode([currentPos[0] + 1, currentPos[1]])) {
            // Node is possible
            if (openNode([currentPos[0] + 1, currentPos[1]])) {
                // Solution Possible
                map[currentPos[1]][currentPos[0]] = "1";
                return true;
            }
            // Not Possible
        }
    }
    // No solutions
    return false;
};
const backtraceSolution = (currentPos) => {
    map[currentPos[1]][currentPos[0]] = "0";
    if (compareNodes(currentPos, endPos)) {
        // Path found
        return "";
    }
    // Check N bounds
    if (currentPos[1] > 0) {
        if (map[currentPos[1] - 1][currentPos[0]] == "1") {
            return `N${backtraceSolution([currentPos[0], currentPos[1] - 1])}`;
        }
    }
    // Check W bounds
    if (currentPos[0] > 0) {
        if (map[currentPos[1]][currentPos[0] - 1] == "1") {
            return `W${backtraceSolution([currentPos[0] - 1, currentPos[1]])}`;
        }
    }
    // Check S bounds
    if (currentPos[1] < ylength - 1) {
        if (map[currentPos[1] + 1][currentPos[0]] == "1") {
            return `S${backtraceSolution([currentPos[0], currentPos[1] + 1])}`;
        }
    }
    // Check E bounds
    if (currentPos[0] < xlength - 1) {
        if (map[currentPos[1]][currentPos[0] + 1] == "1") {
            return `E${backtraceSolution([currentPos[0] + 1, currentPos[1]])}`;
        }
    }
};
const init = async () => {
    const data = await getMaze(`random`);
    const mazeUrl = `${data[`mazePath`].split(`/`)[2]}/${data[`mazePath`].split(`/`)[3]}`;
    map = [...data[`map`]];
    ylength = map.length;
    xlength = map[0].length;
    starPos = data[`startingPosition`];
    endPos = data[`endingPosition`];
    let solution = "";
    if (openNode(starPos)) {
        // Solution found, backtrace it
        solution = backtraceSolution(starPos);
    }
    const response = postMaze(mazeUrl, solution);
};
