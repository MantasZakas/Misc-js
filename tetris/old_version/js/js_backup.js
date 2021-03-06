"use strict";

$(function () {

    const TETRIS_FIELD_HEIGHT = 200; //10 for each row, starting at row 10
    const TETRIS_FIELD_WIDTH = 9; //1 for each column, starting at column 0
    let activePositions = [[4, 210], [5, 210], [4, 220], [5, 220]]; //cells occupied by active segments
    let doomCounter = 2; //if this reaches 0, the game is over
    //TODO tetrominos should probably spawn one row lover

    prepareTetrisField();
    setKeyListener();
    toggleTetrisSegments(true); //TODO remove this line later
    // test(); //TODO remove this line later
    changeTurn();

    /**
     * Prepare the table that serves as the play field
     */
    function prepareTetrisField() {
        let tetrisField = $("#tetris_field");
        for (let rowNo = TETRIS_FIELD_HEIGHT + 40; rowNo > 0; rowNo -= 10) { //+40 to create a spawn area for segments
            let fieldRow = '<tr>';
            if (rowNo > TETRIS_FIELD_HEIGHT) fieldRow = '<tr class="d-none">'; //hide the spawn area
            for (let colNo = 0; colNo < TETRIS_FIELD_WIDTH + 1; colNo++) {
                fieldRow += ('<td class="' + colNo + ' ' + rowNo + '"></td>');
            }
            fieldRow += '</tr>';
            tetrisField.append(fieldRow);
        }
    }

    /**
     * Add keyboard listener which allows controlled movement of tetris segments
     */
    function setKeyListener() {
        $(document).keydown(function (e) {
            console.log(e.which);
            let recognisedKeys = [40, 38, 37, 39]; //TODO might need to change this to a key mapping object
            if (recognisedKeys.includes(e.which)) { //ignore not understood key presses
                let newPositions = [];
                switch (e.which) {
                    case 40:
                        newPositions = generateNewPositions(1, -10);//down
                        break;
                    case 38:
                        newPositions = generateNewPositions(1, 10);//up TODO remove later
                        break;
                    case 37:
                        newPositions = generateNewPositions(0, -1);//left
                        break;
                    case 39:
                        newPositions = generateNewPositions(0, 1);//right
                        break;
                }
                // if (e.which === 40) newPositions = generateNewPositions(1, -10);//down
                // if (e.which === 38) newPositions = generateNewPositions(1, 10);//up TODO remove later
                // if (e.which === 37) newPositions = generateNewPositions(0, -1);//left
                // if (e.which === 39) newPositions = generateNewPositions(0, 1);//right
                moveTetrisSegments(newPositions);
                // if (activePositions !== newPositions) {
                //     moveTetrisSegments(newPositions);
                // }
            }
        })
    }

    /**
     *
     * @param {number} colOrRow // 0 for col; 1 for row
     * @param {number} magnitude // +-1 or +-10
     * @returns {Array}
     */
    function generateNewPositions(colOrRow, magnitude) {
        let newPositions = [];
        for (let positionNo in activePositions) {
            let newPosition = activePositions[positionNo].slice();
            newPosition[colOrRow] += magnitude;
            if (!validateNewPosition(newPosition)) {
                newPositions = activePositions.slice();
                break
            }
            newPositions.push(newPosition);
        }
        return newPositions
    }

    /**
     * Draw or delete tetris segments
     * @param {boolean} draw // true for draw; false for delete
     */
    function toggleTetrisSegments(draw) {
        activePositions.forEach(function (position) {
            let tetrisCell = document.getElementsByClassName(position[1].toString())[position[0]];
            if (draw) {
                tetrisCell.innerHTML = '<div class="tetris-segment"></div>'
            } else {
                tetrisCell.innerHTML = ''
            }
        }); //TODO add stability by checking segments and cells before drawing or deleting
    }

    /**
     * Move segments to a new position
     * @param {array} newPositions
     * @returns {boolean} // true if the new position is the same as the old one
     */
    function moveTetrisSegments(newPositions) {
        let sameCounter = 0;
        for (let positionNo = 0; positionNo < 4; positionNo++) {
            if (newPositions[positionNo][0] === activePositions[positionNo][0] &&
                newPositions[positionNo][1] === activePositions[positionNo][1]) {
                sameCounter++;
                if (sameCounter === 4) return true //break if segments cannot move
            }
        }
        toggleTetrisSegments(false); //delete old segments
        activePositions = newPositions.slice();
        toggleTetrisSegments(true); //draw new segments
    }

    /**
     * Checks if new position of a segment is inside the play field and not filled
     * @param {array} newPosition
     * @returns {boolean}
     */
    function validateNewPosition(newPosition) {
        let valid = true;
        if (newPosition[0] < 0 || newPosition[0] > TETRIS_FIELD_WIDTH) valid = false;
        if (newPosition[1] < 10 || newPosition[1] > TETRIS_FIELD_HEIGHT + 40) valid = false;
        if (valid && document.getElementsByClassName(newPosition[1].toString())[newPosition[0]].innerHTML ===
            '<div class="tetris-segment"></div>') { //if cell is taken by a segment, block TODO might remove the precise check
            valid = false;
            activePositions.forEach(function(position) { //if cell is taken by the active tetromino, allow
                if (newPosition.includes(position[0]) && newPosition.includes(position[1])) {
                    valid = true
                }
            });
        }
        return valid
    }

    /**
     * Self calling version of moveTetrisSegments to allow spawning of new segments
     * @param {number} colOrRow // 0 for col; 1 for row
     * @param {number} magnitude // +-1 or +-10
     */
    function moveAndSpawnTetrisSegments(colOrRow, magnitude) {
        if (moveTetrisSegments(generateNewPositions(colOrRow, magnitude))) { //simulate "gravity"
            console.log ("oops"); //this code is done if a new piece needs to spawn
            //TODO add to separate array for full line checking
            activePositions = [[4, 210], [5, 210], [4, 220], [5, 220]]; //TODO change to random tetromino
            doomCounter--;
            if (doomCounter === 0) return; //break loop if there is no space to spawn new pieces TODO make this better
            moveAndSpawnTetrisSegments(colOrRow, magnitude); //not wait for a new turn to spawn a new tetromino
        }
    }

    /**
     * Self calling loop that takes care of what happens each turn
     */
    function changeTurn() { //TODO timeout should probably become a global variable
        setTimeout(function () {
            console.log("turn");
            moveAndSpawnTetrisSegments(1, -10);
            // if (moveTetrisSegments(generateNewPositions(1, -10))) { //simulate "gravity"
            //     console.log ("oops");
            //     activePositions = [[4, 210], [5, 210], [4, 220], [5, 220]];
            // }
            if (doomCounter > 0) {
                doomCounter = 2; //reset the doom counter if there was space to spawn a new piece
                changeTurn();
            } else {
                console.log("Game over"); //TODO add a game over screen
            }
        }, 1000)
    }

    function test() { //TODO remove this later
        document.getElementsByClassName("100")[5].innerHTML = '<div class="tetris-segment"></div>'
    }

});