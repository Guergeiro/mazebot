const apiUrl = `https://api.noopschallenge.com/mazebot`;
let map: Array<Array<string>>;
let startPos: Array<number>;
let endPos: Array<number>;
let ylength: number;
let xlength: number;

/*
 * Async func that gets the maze
 * @param type: contains string that will be appended to main endpoint
 * @return: JSON data with the maze
 */
const getMaze = async (type: string) => {
    const response = await fetch(`${apiUrl}/${type}`);
    const data = await response.json();
    return data;
}

/*
 * Async funct that posts the solution to the maze
 * @param mazeUrl: contains string with maze url
 * @param solution: contains string with the maze solution
 * @return: true if solution correct, false otherwise
 */
const postMaze = async (mazeUrl: string, solution: string) => {
    let json = { "directions": solution };
    const response = await fetch(`${apiUrl}/${mazeUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json)
    });
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
 * Checks if a given node is available, X means wall, 0 means already visited position
 * @param node: contains array with position of node we want to check
 * @return: true if possible, false otherwise
 */
const checkNode = (node: Array<number>) => {
    if (map[node[1]][node[0]] == "X") {
        return false;
    }
    return true;
}

/*
 * Populates the map with the distance to the endpoint, recursevily
 * @param currentPos: contains array with current position
 * @param distance: contains distance that is incremented recursively
 */
const populateMap = (currentPos: Array<number>, distance: number) => {
    map[currentPos[1]][currentPos[0]] = `${distance}`;
    // Check N bounds
    if (currentPos[1] > 0) {
        if (checkNode([currentPos[0], currentPos[1] - 1])) {
            // Node is possible
            if (map[currentPos[1] - 1][currentPos[0]] != " " && map[currentPos[1] - 1][currentPos[0]] != "A" && map[currentPos[1] - 1][currentPos[0]] != "B") {
                if (distance + 1 < Number(map[currentPos[1] - 1][currentPos[0]])) {
                    // Distance is smaller
                    populateMap([currentPos[0], currentPos[1] - 1], distance + 1);
                }
            } else {
                populateMap([currentPos[0], currentPos[1] - 1], distance + 1);
            }
        }
    }
    // Check W bounds
    if (currentPos[0] > 0) {
        if (checkNode([currentPos[0] - 1, currentPos[1]])) {
            // Node is possible
            if (map[currentPos[1]][currentPos[0] - 1] != " " && map[currentPos[1]][currentPos[0] - 1] != "A" && map[currentPos[1]][currentPos[0] - 1] != "B") {
                if (distance + 1 < Number(map[currentPos[1]][currentPos[0] - 1])) {
                    // Distance is smaller
                    populateMap([currentPos[0] - 1, currentPos[1]], distance + 1);
                }
            } else {
                populateMap([currentPos[0] - 1, currentPos[1]], distance + 1);
            }
        }
    }
    // Check S bounds
    if (currentPos[1] < ylength - 1) {
        if (checkNode([currentPos[0], currentPos[1] + 1])) {
            // Node is possible
            if (map[currentPos[1] + 1][currentPos[0]] != " " && map[currentPos[1] + 1][currentPos[0]] != "A" && map[currentPos[1] + 1][currentPos[0]] != "B") {
                if (distance + 1 < Number(map[currentPos[1] + 1][currentPos[0]])) {
                    // Distance is smaller
                    populateMap([currentPos[0], currentPos[1] + 1], distance + 1);
                }
            } else {
                populateMap([currentPos[0], currentPos[1] + 1], distance + 1);
            }
        }
    }
    // Check E bounds
    if (currentPos[0] < xlength - 1) {
        if (checkNode([currentPos[0] + 1, currentPos[1]])) {
            // Node is possible
            if (map[currentPos[1]][currentPos[0] + 1] != " " && map[currentPos[1]][currentPos[0] + 1] != "A" && map[currentPos[1]][currentPos[0] + 1] != "B") {
                if (distance + 1 < Number(map[currentPos[1]][currentPos[0] + 1])) {
                    // Distance is smaller
                    populateMap([currentPos[0] + 1, currentPos[1]], distance + 1);
                }
            } else {
                populateMap([currentPos[0] + 1, currentPos[1]], distance + 1);
            }
        }
    }
}

const solveMaze = (currentPos: Array<number>) => {
    // Found end
    if (compareNodes(currentPos, endPos)) {
        return "";
    }
    let dict = { "N": null, "W": null, "S": null, "E": null };
    // Check N bounds
    if (currentPos[1] > 0) {
        dict["N"] = map[currentPos[1] - 1][currentPos[0]];
    }
    // Check W bounds
    if (currentPos[0] > 0) {
        dict["W"] = map[currentPos[1]][currentPos[0] - 1];
    }
    // Check S bounds
    if (currentPos[1] < ylength - 1) {
        dict["S"] = map[currentPos[1] + 1][currentPos[0]];
    }
    // Check E bounds
    if (currentPos[0] < xlength - 1) {
        dict["E"] = map[currentPos[1]][currentPos[0] + 1];
    }

    // Create items array
    let items = Object.keys(dict).map(key => [key, dict[key]]);

    // Sort the array based on the second element
    items.sort((item1, item2) => {
        if (item1[1] == null || item1[1] == " " || item1[1] == "X") {
            return +1;
        }
        if (item2[1] == null || item2[1] == " " || item2[1] == "X") {
            return -1;
        }
        return item1[1] - item2[1];
    });

    switch (items[0][0]) {
        case "N":
            return `N${solveMaze([currentPos[0], currentPos[1] - 1])}`;
        case "W":
            return `W${solveMaze([currentPos[0] - 1, currentPos[1]])}`;
        case "S":
            return `S${solveMaze([currentPos[0], currentPos[1] + 1])}`;
        case "E":
            return `E${solveMaze([currentPos[0] + 1, currentPos[1]])}`;
    }
}

const init = async () => {
    // Get maze
    const data = await getMaze(`random`);

    // Initialize global variables
    map = [...data[`map`]];
    ylength = map.length;
    xlength = map[0].length;
    startPos = data[`startingPosition`];
    endPos = data[`endingPosition`];

    // Populate maze
    populateMap(endPos, 0);

    // Solve maze
    let solution = solveMaze(startPos);

    // Post maze
    const mazeUrl = `${data[`mazePath`].split(`/`)[2]}/${data[`mazePath`].split(`/`)[3]}`;
    const response = await postMaze(mazeUrl, solution);
}
