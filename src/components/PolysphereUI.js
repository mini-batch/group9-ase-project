import React, { useEffect, useState, useRef } from "react";
import { create_dicts } from "./Logic/PolysphereLogic/Create_dict_objects.js";
import { convert_to_5x11 } from "./Logic/PolysphereLogic/Create_solution.js";
import { generate_headers, populate_problem_matrix, reduce_problem_matrix } from "./Logic/PolysphereLogic/Generate_problem_matrix.js";
import { A } from "./Logic/PolysphereLogic/Shapes.js";
import { solve, sets, items } from "./Logic/PolysphereLogic/Solver.js";
import "./PolysphereUI.css";

function Polysphere() {
    document.body.style.backgroundColor = 'rgba(182, 122, 11, 0.342)';
    const [inBoard, setInBoard] = useState(drawInBoard())
    const [outBoard, setOutBoard] = useState(drawOutBoard());
    const stopExecution = useRef(false);
    const [warningIndicator, setWarningIndicator] = useState(false);
    const [solutions, setSolutions] = useState([]);

    const Colours = {
        "A": "#ff0000",
        "B": "#ff0080",
        "C": "#ff99cc",
        "D": "#0000ff",
        "E": "#ffff00",
        "F": "#cc6699",
        "G": "#660033",
        "H": "#4dff4d",
        "I": "#e65c00",
        "J": "#006600",
        "K": "#ff9900",
        "L": "#00bfff"
    }

    // Used to draw solution on outBoard (position is 5 by 11 nest array (same as output from backend))
    function drawPosition (position) {
        for (let i = 0; i < position.length; i++) {
            for (let j = 0; j < position[0].length; j++) {
                if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].indexOf(position[i][j]) !== -1) {
                    document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = Colours[position[i][j]];
                }
                else {
                    document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = "white" ;
                }
                
            }
        }
    }

    // Used to reset the outBoard to all white squares
    function clearPosition() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 11; j++) {
                document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = "white" ;
            }
        }
    }

    // Used to initially create board elements upon page loading
    function drawInBoard () {
        let b = [];
        for (let i = 0; i < 5; i++) {
            let row = [];
            for (let j = 0; j < 11; j++) {
                row.push(<div id={"i," + i.toString() + "," + j.toString()} className="square" key={i.toString() + "," + j.toString()}>
                            <input type="string" className="inBoardInput"></input>
                        </div>);
            }
            b.push(row);
        }
        return b;
    }

    // To convert input to arrays to be used in solving
    function convert_inBoard_to_arrays() {
        let in_shapes = [];
        let in_squares = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 11; j++) {
                let input = document.getElementById("i," + i.toString() + "," + j.toString()).childNodes[0].value;
                //console.log(input);
                if (input === "") {
                    //console.log("Null");
                    continue;
                }
                else {
                    //console.log(input);
                    if (in_shapes.indexOf(input) === -1) {
                        in_shapes.push(input);
                        in_squares.push([i.toString() + "," + j.toString()]);
                    }
                    else {
                        in_squares[in_shapes.indexOf(input)].push(i.toString() + "," + j.toString());
                    }
                }
            }
        }
        return [in_shapes, in_squares];
    }

    // Used to initially create board elements upon page loading
    function drawOutBoard () {
        let b = [];
        for (let i = 0; i < 5; i++) {
            let row = [];
            for (let j = 0; j < 11; j++) {
                row.push(<div id={i.toString() + "," + j.toString()} className="square" key={i.toString() + "," + j.toString()}></div>)
            }
            b.push(row);
        }
        return b;
    }

    function onLoadButtonClick() {
        drawOutBoard();
        /*
        let start_shapes = ["A", "B", "C", "K"];
        let start_squares = [["0,0","0,1","0,2","1,0","1,2"],["1,1","2,1","3,1","3,2","4,2"],["4,10","4,9", "3,9", "3,8", "2,9"],["3,7","4,7","4,8"]]
        let problem_mat = populate_problem_matrix();
        let problem_def = reduce_problem_matrix(problem_mat, generate_headers(problem_mat), start_shapes, start_squares);
        problem_mat = problem_def[0];
        let headers = problem_def[1];
        let dicts = create_dicts(problem_mat, headers);
        let count = 0;
        for (let i of solve(dicts[0], dicts[1])) {
            console.log(i);
            console.log(convert_to_5x11(i, problem_mat, headers, start_shapes, start_squares));
            count += 1;
            if (count === 10) {
                //break;
            }
            console.log(count);
        }
        console.log("Fin");*/
    };


    function onSolveButtonClick(start_shapes_input, start_squares_input) {
        //stopExecution.current = false;
        console.log(convert_inBoard_to_arrays());
        let input = convert_inBoard_to_arrays();
        let input_shapes = input[0];
        let input_squares = input[1];
        /*if (start_shapes_input !== "") {
            let start_shapes = start_shapes_input.split(",");
            let start_squares = start_squares_input.split(",");
        }        
        drawPosition([["A","A","A","B","C","E","F","G","H","I","J"],
                      ["A",0,"A",0,0,0,0,0,0,"L","K"],
                      [0,0,0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0,0,0,0],]);
        */
        let problem_mat = populate_problem_matrix();
        let problem_def = reduce_problem_matrix(problem_mat, generate_headers(problem_mat), input_shapes, input_squares);
        problem_mat = problem_def[0];
        let headers = problem_def[1];
        let dicts = create_dicts(problem_mat, headers);
        let count = 0;
        //const solution_gen = solve(dicts[0], dicts[1]);
        /*
        while (true) {
            console.log(stopExecution.current);
            if (stopExecution.current) {
                break;
            }
            console.log(solution_gen.next());
            if (count === 500) {
                break;
            }
            count += 1;
        }*/

        for (let i of solve(dicts[0], dicts[1])) {
            //if (stopExecution.current) {
             //   break;
            //}
            console.log(i);
            console.log(convert_to_5x11(i, problem_mat, headers, input_shapes, input_squares));
            drawPosition(convert_to_5x11(i, problem_mat, headers, input_shapes, input_squares))
            count += 1;
            if (count === 10) {
                //break;
            }
            console.log(count);
        }
        console.log("Fin");
    };

    function onClearButtonClick() {
        clearPosition();
    };

    function onStopButtonClick() {
        stopExecution.current = true;
        console.log(stopExecution.current);
    }

    return (
        <div className="home">
            <div className="container">
                <div className="row align-items-center pt-1" id="toprow">
                    <h1>
                        Polysphere Puzzle
                    </h1>
                    <form id="positionInputForm">
                        <p>
                            Example input: Shape A in top left corner, shape K in top right.<br></br>
                            Used Shapes = "A, K", Used Squares = "[0,0; 0,1; 0,2; 1,0; 1,2], [0,9; 0,10; 1,10]"
                        </p>
                        <input id="usedShapeInputBox" name="usedShapeInputBox" placeholder="Used Shapes" type="text" ></input>
                        <input id="usedSquaresInputBox" name="usedSquaresInputBox" placeholder="Used Squares" type="text" ></input>
                        <button type="button" onClick={() => onSolveButtonClick(document.getElementById("usedShapeInputBox").value, document.getElementById("usedSquaresInputBox").value)}>Solve</button>
                        <button type="button" onClick={() => onClearButtonClick()}>Clear</button>
                        <button type="button" onClick={() => onStopButtonClick()}>Stop</button>
                    </form>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row board">
                    <div className="boardContainer">
                        {inBoard}
                    </div>
                </div>
                <div className="row board">
                    <div className="boardContainer">
                        {outBoard}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Polysphere;