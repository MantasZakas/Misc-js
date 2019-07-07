"use strict";

$(function() {

    let positions = [[4, 140], [5, 140], [4, 150], [5, 150]];

    prepareTetrisField();
    setKeyListener();
    moveTetrisSegments(true); //TODO remove this line later

    /**
     * Prepare the table that serves as the play field
     */
    function prepareTetrisField () {
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
    function setKeyListener () { //TODO stop tetrominos from moving outside of field
        $(document).keydown(function (e) {
            let newPositions = [];
            if (e.which === 40) newPositions = generateNewPositions(1,-10);
            if (e.which === 38) newPositions = generateNewPositions(1,10);
            if (e.which === 37) newPositions = generateNewPositions(0,-1);
            if (e.which === 39) newPositions = generateNewPositions(0,1);
            moveTetrisSegments(false); //delete old segments
            positions = newPositions.slice();
            moveTetrisSegments(true); //draw new segments
        })
    }

    /**
     *
     * @param {number} colOrRow // 0 for col; 1 for row
     * @param {number} magnitude // +-1 or +-10
     * @returns {Array}
     */
    function generateNewPositions (colOrRow, magnitude) {
        let newPositions = [];
        positions.forEach(function(position) {
            let newPosition = position.slice();
            newPosition[colOrRow] += magnitude;
            newPositions.push(newPosition);
        });
        return newPositions
    }

    /**
     * Draw or delete tetris segments
     * @param {boolean} draw // true for draw; false for delete
     */
    function moveTetrisSegments (draw) {
        positions.forEach(function(position) {
            let tetrisCell = document.getElementsByClassName(position[1].toString())[position[0]];
            if (draw) {
                tetrisCell.innerHTML = '<div class="tetris-segment"></div>'
            } else {
                tetrisCell.innerHTML = ''
            }
        }); //TODO add stability by checking segments and cells before drawing or deleting
    }
});