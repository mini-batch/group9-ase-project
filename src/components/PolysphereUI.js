import React, { useEffect, useState } from "react";
import { create_dicts } from "./Logic/PolysphereLogic/Create_dict_objects.js";
import { convert_to_5x11 } from "./Logic/PolysphereLogic/Create_solution.js";
import { generate_headers, populate_problem_matrix, reduce_problem_matrix } from "./Logic/PolysphereLogic/Generate_problem_matrix.js";
import { A } from "./Logic/PolysphereLogic/Shapes.js";
import { solve, sets, items } from "./Logic/PolysphereLogic/Solver.js";

function Polysphere() {
    function onLoadButtonClick() {
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
        console.log("Fin");
    };

    return (
        <div className="home">
            <div className="container">
                <div className="row align-items-center pt-1" id="toprow">
                    <h1>
                        Polysphere Puzzle
                    </h1>
                    <button type="button" onClick={() => onLoadButtonClick()}>Load</button>
                </div>
            </div>
        </div>
    );
}

export default Polysphere;