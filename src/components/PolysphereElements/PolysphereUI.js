import React, { useEffect, useState, useRef } from "react";
import { create_dicts } from "../Logic/PolysphereLogic/Create_dict_objects.js";
import { convert_to_5x11 } from "../Logic/PolysphereLogic/Create_solution.js";
import { generate_headers, populate_problem_matrix, reduce_problem_matrix } from "../Logic/PolysphereLogic/Generate_problem_matrix.js";
import { solve, sets, items } from "../Logic/PolysphereLogic/Solver.js";
import "./PolysphereUI.css";
import Legend from '../../Images/ShapeLegend.png';

const FPS = 144;
let uiTimer = null;
const createTimer = (func) => {
    if (uiTimer) {
        clearInterval(uiTimer);
        uiTimer = null;
    }

    uiTimer = setInterval(() => {
        func();
    }, 1000 / FPS);
}

window.onbeforeunload = () => {
    if (uiTimer) clearTimeout(uiTimer);
}

function Polysphere() {
    document.body.style.backgroundColor = 'rgba(182, 122, 11, 0.342)';
    const [inBoard, setInBoard] = useState(drawInBoard())
    const [outBoard, setOutBoard] = useState(drawOutBoard());
    const stopExecution = useRef(false);
    const [warningIndicator, setWarningIndicator] = useState(false);
    const [solutionCount, setSolutionCount] = useState(0);
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
                if (input === "") {
                    continue;
                }
                else {
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

    function onNextButtonClick() {
        drawPosition(solutions.pop());
    }

    let input;
    let input_shapes;
    let input_squares;
    let problem_mat;
    let problem_def;
    let headers;
    let dicts;
    function onSolveButtonClick() {
        setSolutionCount(0);
        setSolutions([]);
        //stopExecution.current = false;
        console.log(convert_inBoard_to_arrays());
        input = convert_inBoard_to_arrays();
        input_shapes = input[0];
        input_squares = input[1];
        problem_mat = populate_problem_matrix();
        problem_def = reduce_problem_matrix(problem_mat, generate_headers(problem_mat), input_shapes, input_squares);
        problem_mat = problem_def[0];
        headers = problem_def[1];
        dicts = create_dicts(problem_mat, headers);
        let ret = solve(dicts[0], dicts[1]);
        let cnt = 0;
        createTimer(() => {
            let arr = ret.next().value;
            if (!arr) {
                clearInterval(uiTimer);
                uiTimer = null;
                console.log('done');
                return;
            }
            cnt++;
            setSolutionCount(cnt);
            setSolutions(oldArray => [...oldArray,convert_to_5x11(arr, problem_mat, headers, input_shapes, input_squares)]);
            drawPosition(convert_to_5x11(arr, problem_mat, headers, input_shapes, input_squares));
        });
    };
    function onClearButtonClick() {
        setSolutions([]);
        setSolutionCount(0);
        clearPosition();
    };


    function onStopButtonClick() {
        stopExecution.current = true;
        console.log(stopExecution.current);
        clearInterval(uiTimer);
        uiTimer = null;
    }


    return (
        <div className="home">
            <div className="container">
                <div className="row align-items-center pt-1" id="toprow">
                    <h1>
                        Polysphere Puzzle
                    </h1>
                    <form id="positionInputForm"style={{paddingTop:"10px"}}>
                        <button type="button" onClick={() => onSolveButtonClick()}>Solve</button>
                        <button type="button" onClick={() => onClearButtonClick()}>Clear</button>
                        <button type="button" onClick={() => onStopButtonClick()}>Stop</button>
                        <button type="button" onClick={() => onNextButtonClick()}>Display Next</button>
                        <p>Number of solutions: {solutionCount}</p>
                    </form>
                    </div>
                <div className="row align-items-center justify-content-center pt-1" id="legend">
                    <img src={Legend} style={{width:"40%"}}></img>
                    </div>
            </div>
            <div className="container-fluid">
                <div className="row board">
                    <div className="boardContainer">
                        {inBoard}
                    </div>
                </div>
                <div className="row board">
                    <div id="resultBoard" className="boardContainer">
                        {outBoard}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Polysphere;