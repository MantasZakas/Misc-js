"use strict";

$(function () {

    let activePositions = [[4, 140], [5, 140], [4, 150], [5, 150]];

    prepareTetrisField();
    setKeyListener();
    moveTetrisSegments(true); //TODO remove this line later

    /**
     * Prepare the table that serves as the play field
     */
    function prepareTetrisField() {
        let tetrisField = $("#tetris_field");
        for (let rowNo = 200; rowNo > 0; rowNo -= 10) {
            let fieldRow = '<tr>';
            for (let colNo = 0; colNo < 10; colNo++) {
                fieldRow += ('<td class="' + colNo + ' ' + rowNo + '"></td>');
            }
            fieldRow += '</tr>';
            tetrisField.append(fieldRow);
        }
    }

    /**
     * Add keyboard listener which allows controlled movement of tetris segments
     */
    function setKeyListener() { //TODO stop tetrominos from moving outside of field
        $(document).keydown(function (e) {
            console.log(e.which);
            let recognisedKeys = [40, 38, 37, 39]; //TODO might need to change this to a key mapping object
            if (recognisedKeys.includes(e.which)) { //ignore not understood key presses
                let newPositions = [];
                if (e.which === 40) newPositions = generateNewPositions(1, -10);//down
                if (e.which === 38) newPositions = generateNewPositions(1, 10);//up
                if (e.which === 37) newPositions = generateNewPositions(0, -1);//left
                if (e.which === 39) newPositions = generateNewPositions(0, 1);//right
                if (activePositions !== newPositions) {
                    moveTetrisSegments(false); //delete old segments
                    activePositions = newPositions.slice();
                    moveTetrisSegments(true); //draw new segments
                }
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
                break //TODO might need to return some king of signal here
            }
            newPositions.push(newPosition);
        }
        return newPositions
    }

    // function generateNewPositions (colOrRow, magnitude) {
    //     let newPositions = [];
    //     activePositions.forEach(function(position) {
    //         let newPosition = position.slice();
    //         newPosition[colOrRow] += magnitude;
    //         if (!validateNewPosition(newPosition)) return activePositions;
    //         newPositions.push(newPosition);
    //     });
    //     return newPositions
    // }

    /**
     * Draw or delete tetris segments
     * @param {boolean} draw // true for draw; false for delete
     */
    function moveTetrisSegments(draw) {
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
     * Checks if new position of a segment is inside the play field
     * @param {array} newPosition
     * @returns {boolean}
     */
    function validateNewPosition(newPosition) { //TODO automate tetris field size
        let valid = true;
        if (newPosition[0] < 0 || newPosition[0] > 9) valid = false;
        if (newPosition[1] < 10 || newPosition[1] > 200) valid = false;
        return valid
    }
});