import React, { useEffect, useState } from "react";
import { A } from "./Logic/PolysphereLogic/Shapes.js";


function Polysphere() {

    function onLoadButtonClick() {
        console.log(A.layout);
    };

    return (
        <div className="home">
            <div className="container">
                <div className="row align-items-center pt-1" id="toprow">
                    <h1>
                        Polysphere Puzzle
                    </h1>
                    <input type="number" placeholder="Number of squares"></input>
                    <button type="button" onClick={() => onLoadButtonClick()}>Load</button>
                </div>
            </div>
        </div>
    );
}

export default Polysphere;