"use strict";

$(function() {

    let position = [4, 140];

    prepareTetrisField();
    setKeyListener();
    move(); //TODO remove this line later

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
    function setKeyListener () {
        $(document).keydown(function (e) {
            console.log(e.which);
            let newPosition = position.slice();
            if (e.which === 40 && newPosition[1] > 10) newPosition[1] -= 10;
            if (e.which === 38 && newPosition[1] < 200) newPosition[1] += 10;
            if (e.which === 37 && newPosition[0] > 0) newPosition[0] -= 1;
            if (e.which === 39 && newPosition[0] < 9) newPosition[0] += 1;

            let originalTetrisCell = document.getElementsByClassName(position[1].toString())[position[0]];
            originalTetrisCell.innerHTML = '';
            position = newPosition.slice();
            move();
        })
    }

    function move () {
        let col = position[0];
        let row = position[1];
        row = row.toString();
        document.getElementsByClassName(row)[col].innerHTML = '<div class="tetris-segment"></div>';
    }
});