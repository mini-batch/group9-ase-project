import React, { useEffect, useState } from "react";
import { Shape } from "./Logic/PolysphereLogic/Shape.js";
import { A } from "./Logic/PolysphereLogic/Shapes.js";
import { solve, sets, items } from "./Logic/PolysphereLogic/Solver.js";

function Polysphere() {
    function onLoadButtonClick() {
        for (let i of solve(sets, items)) {
            console.log(i)
        }
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