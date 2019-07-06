"use strict";

$(function() {

    prepareTetrisField();
    setKeyListener();

    let position = [4, 140];
    test();

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

    function setKeyListener () {
        $(document).keydown(function (e) {
            console.log(e.which);
            
        })
    }

    function test () {
        let col = position[0];
        let row = position[1];
        row = row.toString();
        document.getElementsByClassName(row)[col].innerHTML = '<div class="tetris-segment"></div>';
    }
});