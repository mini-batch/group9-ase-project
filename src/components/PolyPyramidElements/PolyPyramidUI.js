import React, { useEffect, useState, useRef, createRef } from "react";
import "./PolyPyramidUI.css";
import Scene from "./PolyPyramidScene"
import Pyramid from './Pyramid'
import { convert_to_pyramid_layers } from "../Logic/PolyPyramidLogic/ConvertSolutionFormat";
import { generate_headers, populate_problem_matrix3D, reduce_problem_matrix } from "../Logic/PolyPyramidLogic/Generate_problem_matrix3D";
import { create_dicts } from "../Logic/PolysphereLogic/Create_dict_objects";
import { solve } from "../Logic/PolysphereLogic/Solver";
import { getShape } from "../Logic/PolyPyramidLogic/Shapes3D"

// 创建一个五层金字塔
let worker = new Pyramid(5, 1);
const scene = new Scene();

const FPS = 30;
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

const Colours = {
    "A": 0xff0000,
    "B": 0xff0080,
    "C": 0xff99cc,
    "D": 0x0000ff,
    "E": 0xffff00,
    "F": 0xcc6699,
    "G": 0x660033,
    "H": 0x4dff4d,
    "I": 0xe65c00,
    "J": 0x006600,
    "K": 0xff9900,
    "L": 0x00bfff
}


function renderPyramid() {
    for (let i = 0; i < worker.layers.length; i++) {
        const spheres = worker.layers[i].matrix;
        for (let x = 0; x < worker.layers[i].size; x++) {
            for (let y = 0; y < worker.layers[i].size; y++) {
                let pos = spheres[x][y].pos;
                let color = spheres[x][y].color;

                if (!spheres[x][y].userData) {
                    spheres[x][y].userData =
                        scene.createSphere(pos[0], pos[1], pos[2], color, worker.radius());
                    scene.add(spheres[x][y].userData);
                } else {
                    spheres[x][y].userData.material.color.set(color);
                    spheres[x][y].userData.material.specular.set(color);
                    // spheres[x][y].userData.material.needsUpdate = true;
                }
            }
        }
    }
}

function disposePyramid() {
    for (let i = 0; i < worker.layers.length; i++) {
        const spheres = worker.layers[i].matrix;
        for (let x = 0; x < worker.layers[i].size; x++) {
            for (let y = 0; y < worker.layers[i].size; y++) {
                if (!spheres[x][y].userData) {
                    scene.disposeSphere(spheres[x][y].userData);
                }
            }
        }
    }
}



function layerVisible(idx, v) {
    console.log("layerVisible " + idx + v)
    let layer = worker.getLayer(idx);
    const spheres = layer.matrix;
    for (let x = 0; x < layer.size; x++) {
        for (let y = 0; y < layer.size; y++) {
            if (spheres[x][y].userData) {
                spheres[x][y].userData.visible = v;
                spheres[x][y].userData.needsUpdate = true;
                console.log("?")
            }
        }
    }
}

let input;
let input_shapes;
let input_squares;
let problem_mat;
let problem_def;
let headers;
let dicts;
class PolyPyramid extends React.Component {
    constructor(props) {
        super(props);
        this.panel = createRef();
        this.inputRef = {
            shape: createRef(),
            inputX: createRef(),
            inputY: createRef(),
            inputZ: createRef()
        }
        this.onSolveButtonClick = this.onSolveButtonClick.bind(this);
        this.state = {
            stopExecution: false,
            solutionCount: 0,
            solutions: []
        }
    }

    // Used to draw solution pyramid (position output from backend)
    drawPosition(position) {
        for (let layer = 0; layer < position.length; layer++) {
            for (let i = 0; i < position[layer].length; i++) {
                for (let j = 0; j < position[layer].length; j++) {
                    if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].indexOf(position[layer][i][j]) !== -1) {
                        // Set to shape colour
                        worker.getLayer(5 - layer).set(i, j, Colours[position[layer][i][j]]);
                    }
                    else {
                        // Set to black to indicate empty
                        worker.getLayer(5 - layer).set(i, j, 0x233333);
                    }
                }
            }
        }
        renderPyramid();
    }


    onSolveButtonClick() {
        this.setState({
            solutionCount: 0,
            solutions: [],
            stopExecution: false
        })
        //console.log(convert_inBoard_to_arrays());
        //input = convert_inBoard_to_arrays();

        // get inputs
        // parseInt(this.inputRef.inputX);
        console.log(getShape(this.inputRef.shape.current.value));

        input = [["A"], [[[0, 0, 4], [1, 1, 3], [2, 2, 2], [2, 2, 1], [0, 0, 3]]]];
        input_shapes = input[0];
        input_squares = input[1];
        problem_mat = populate_problem_matrix3D();
        problem_def = reduce_problem_matrix(problem_mat, generate_headers(problem_mat), input_shapes, input_squares);
        problem_mat = problem_def[0];
        headers = problem_def[1];
        //headers = generate_headers(problem_mat);
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
            this.setState({ solutionCount: cnt });
            let pyramid_layers = convert_to_pyramid_layers(arr, problem_mat, headers, input_shapes, input_squares);
            this.setState({ solutions: [...this.state.solutions, pyramid_layers] });
            this.drawPosition(pyramid_layers);
        });
    };

    onNextButtonClick() {
        this.drawPosition(this.state.solutions.pop());
    }

    onClearButtonClick() {
        this.setState({
            solutions: [],
            solutionCount: 0
        });
        //  Set pyramid to empty and render empty pyramid
        let empty_position = new Array(5);
        for (let i = 0; i < 5; i++) {
            empty_position[i] = new Array(5 - i);
            empty_position[i].fill(0);
        }
        for (let layer = 0; layer < 5; layer++) {
            for (let row = 0; row < 5 - layer; row++) {
                empty_position[layer][row] = new Array(5 - layer);
                empty_position[layer][row].fill(0);
            }
        }
        this.drawPosition(empty_position);
    };

    onStopButtonClick() {
        this.setState({ stopExecution: true })
        clearInterval(uiTimer);
        uiTimer = null;
    }

    componentDidMount() {
        scene.init(this.panel.current);
        renderPyramid();

        // 第五层的第 x, y 个球变成 0xee1166
        /*worker.getLayer(5).set(0, 0, 0xee1166)
        worker.getLayer(1).set(0, 0, 0x7788ff)
        worker.getLayer(3).set(2, 1, 0x88ffcc)
        worker.getLayer(4).set(0, 1, 0x88cfcc)
        worker.getLayer(4).set(1, 3, 0xffffcc)
        // 渲染金字塔*/
        //renderPyramid();
    }

    componentWillUnmount() {
        scene.dispose();
    }

    onInputClick() {
        console.log(this.inputRef.shape.current.value);
        console.log(this.inputRef.inputX.current.value);
        console.log(this.inputRef.inputY.current.value);
        console.log(this.inputRef.inputZ.current.value);

    }

    render() {
        return (
            <div>
                <div className="container">
                    <div ref={this.panel} className="panel">
                    </div>
                </div>
                <form id="positionInputForm" style={{ paddingTop: "10px" }}>
                    <button type="button" onClick={() => this.onSolveButtonClick()}>Solve</button>
                    <button type="button" onClick={() => this.onNextButtonClick()}>Display Next</button>
                    <button type="button" onClick={() => this.onClearButtonClick()}>Clear</button>
                    <button type="button" onClick={() => this.onStopButtonClick()}>Stop</button>
                </form>
                <label htmlFor="inputShape">Shape</label>
                <input ref={this.inputRef.shape} id="inputShape" type="text"
                    onKeyUp={(e) => { e.target.value = e.target.value.replace(/[^A-L]/g, ''); }} defaultValue="A">
                </input>
                <label htmlFor="inputX">X</label>
                <input ref={this.inputRef.inputX} id="inputX" type="text"
                    onKeyUp={(e) => { e.target.value = e.target.value.replace(/[^0-4]/g, ''); }} defaultValue="0">
                </input>
                <label htmlFor="inputY">Y</label>
                <input ref={this.inputRef.inputY} id="inputY" type="text"
                    onKeyUp={(e) => { e.target.value = e.target.replace(/[^0-4]/g, ''); }} defaultValue="0">
                </input>
                <label htmlFor="inputZ">Z</label>
                <input ref={this.inputRef.inputZ} id="inputZ" type="text"
                    onKeyUp={(e) => { e.target.value = e.target.value.replace(/[^1-5]/g, ''); }} defaultValue="5">
                </input>
                <button type="button" onClick={() => this.onInputClick()}>Set</button>


                <p>Number of solutions: {this.state.solutionCount}</p>
                <input id="l1" type="checkbox" defaultChecked
                    onChange={(e) => layerVisible(1, e.target.checked)} />
                <label htmlFor="l1">1</label>
                <input id="l2" type="checkbox" defaultChecked
                    onChange={(e) => layerVisible(2, e.target.checked)} />
                <label htmlFor="l2">2</label>
                <input id="l3" type="checkbox" defaultChecked
                    onChange={(e) => layerVisible(3, e.target.checked)} />
                <label htmlFor="l3">3</label>
                <input id="l4" type="checkbox" defaultChecked
                    onChange={(e) => layerVisible(4, e.target.checked)} />
                <label htmlFor="l4">4</label>
                <input id="l5" type="checkbox" defaultChecked
                    onChange={(e) => layerVisible(5, e.target.checked)} />
                <label htmlFor="l5">5</label>
            </div>
        )
    }
}

export default PolyPyramid;
