"use strict";

$(function () {

    const TETRIS_FIELD_HEIGHT = 20;
    const TETRIS_FIELD_WIDTH = 10;
    let tetrisFieldArray = [];
    let activePositions = [[2, 4], [2, 5], [3, 4], [3, 5]];
    let turnTimer;

    prepareFieldArray();
    setKeyListener();
    updateFieldArray(1);//display initial set up
    test(); //TODO delete this later
    turnTimer = setInterval(changeTurn, 1000); //TODO use clearInterval(turnTimer) on game over

    /**
     * Prep the array that will represent the playing field
     */
    function prepareFieldArray() {
        for (let i = 0; i < TETRIS_FIELD_HEIGHT + 4; i++) {// +4 is for the hidden spawning area
            let tetrisRowArray = [];
            for (let j = 0; j < TETRIS_FIELD_WIDTH; j++) {
                tetrisRowArray.push(0);
            }
            tetrisFieldArray.push(tetrisRowArray);
        }
    }

    /**
     * Create a string that will be used to display the field
     */
    function displayFieldArray() { //TODO make this fancier
        let tetrisFieldString = "<i>"; //TODO hide the spawning area by removing everything between the i tags
        for (let rowNo in tetrisFieldArray) {
            for (let cellNo in tetrisFieldArray[rowNo]) {
                tetrisFieldString += tetrisFieldArray[rowNo][cellNo];
            }
            tetrisFieldString += "<br>";
            if (rowNo === "3") tetrisFieldString += "</i>"
        }
        document.getElementById("tetris_field").innerHTML = tetrisFieldString;
    }

    /**
     * Updates the field array with movements
     */
    function updateFieldArray(number) {//TODO get a better name for this
        for (let positionNo in activePositions) {
            tetrisFieldArray[activePositions[positionNo][0]][activePositions[positionNo][1]] = number;
        }
        displayFieldArray();
    }

    /**
     * Key listener for controlling the active tetromino
     */
    function setKeyListener() {//TODO e.which might be replaced with e.key
        window.addEventListener("keydown", function (e) {
            let recognisedKeys = [40, 38, 37, 39]; //TODO might need to change this to a key mapping object
            if (recognisedKeys.includes(e.which)) { //ignore not understood key presses
                switch (e.which) {
                    case 40:
                        shiftPositions(1, 0);//down TODO this should change turns instead of going down
                        break;
                    case 38:
                        shiftPositions(-1, 0);//up TODO remove later
                        break;
                    case 37:
                        shiftPositions(0, -1);//left
                        break;
                    case 39:
                        shiftPositions(0, 1);//right
                        break;
                }
            }
        })
    }

    /**
     * Update the active tetromino position
     * @param {number}rowShift
     * @param {number}colShift
     */
    function shiftPositions(rowShift, colShift) {
        if (!validateMovement(rowShift, colShift)) return; //TODO might need to change this
        updateFieldArray(0);//remove the active tetromino for the field array
        for (let positionNo in activePositions) {
            activePositions[positionNo][0] += rowShift;
            activePositions[positionNo][1] += colShift;
        }
        updateFieldArray(1);//add the active tetromino back
    }

    /**
     * Check if the tetromino can be moved to the new specified place
     * @param {number}rowShift
     * @param {number}colShift
     * @returns {boolean}
     */
    function validateMovement(rowShift, colShift) {
        let moveIsValid = true;
        for (let positionNo in activePositions) {
            let newRowPosition = activePositions[positionNo][0] + rowShift;
            let newColPosition = activePositions[positionNo][1] + colShift;
            if (newRowPosition < 0 || newRowPosition >= TETRIS_FIELD_HEIGHT + 4 || newColPosition < 0 || newColPosition >= TETRIS_FIELD_WIDTH)
                moveIsValid = false; //tetris field edge collision
            if (tetrisFieldArray[newRowPosition][newColPosition] === 2)
                moveIsValid = false //taken cell collision
        }
        return moveIsValid;
    }

    /**
     * Returns the number of taken cells in a given row
     * @param {number}rowNo
     * @returns {number}
     */
    function checkRow(rowNo) {
        let takenCells = 0;
        for (let cellNo in tetrisFieldArray[rowNo]) {
            if (tetrisFieldArray[rowNo][cellNo] === 2)
                takenCells ++;
        }
        console.log(takenCells);
        return takenCells;
    }

    /**
     * Implements turn changing
     */
    function changeTurn() {
        if (validateMovement(1, 0))//if there is space underneath
            shiftPositions(1, 0);//simulate gravity
        else {
            if (checkRow(3) > 0) {//if there are taken cells in the spawn area
                clearInterval(turnTimer);
                console.log("Game over");//TODO change this to a game over screen
                return;
            }
            updateFieldArray(2);//change active tetromino to inactive cells
            activePositions = [[2, 4], [2, 5], [3, 4], [3, 5]];//spawn a new tetromino TODO make it a random tetromino
            changeTurn();//do not skip a turn when spawning a new tetromino
        }
    }

    function test() {//TODO delete this later
        tetrisFieldArray[10][4] = 2;
        tetrisFieldArray[10][5] = 2;
        displayFieldArray()
    }

});