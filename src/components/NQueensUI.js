import React, { useEffect, useState } from "react";
import "./NQueensUI.css";
import Queen from '../Images/queen.svg';
import { GetSolutionBruteForce } from "./Logic/NQueensLogic.js";
import Warning from "./Warning";

function NQueens() {
    document.body.style.backgroundColor = 'rgba(182, 122, 11, 0.342)';
    const [size, setSize] = useState(0);
    const [board, setBoard] = useState([]);
    const [warningIndicator, setWarningIndicator] = useState(false);
    
    function drawQueens (position) {
        for (let i = 0; i < position.length; i++) {
            if (position[i] === -1) {
                continue;
            }
            else {
                let queenImage = document.createElement("img");
                queenImage.src = Queen;
                queenImage.className = "queen"
                document.getElementById(String(i + position[i] * size)).appendChild(queenImage);
            }
        }
    }

    function destroyQueens() {
        let queens = document.getElementsByClassName("queen");
        while (queens[0]) {
            queens[0].parentNode.removeChild(queens[0]);
        }
    }

    function onLoadButtonClick (positionInput) {
        destroyQueens();
        setWarningIndicator(false);
        //Input validation to ensure the same number isn't inserted twice
        for(let i=0;i<positionInput.length;i++)
         {
            for(let j=i+1;j<positionInput.length;j++)
            {
                if(positionInput[i]===positionInput[j])
                 setWarningIndicator(true);
            }
         }

        let solution = GetSolutionBruteForce(size, positionInput);
        if (solution === -1) {
            setWarningIndicator(true);
        }
        else {
            setWarningIndicator(false);
            drawQueens(solution);
        }
    }

    const boardContainerSetWidth = {
        class:"boardContainer",
        width: size * 100,
    }

    function checkInput (input) {
        return input.replace(/[^0-9]/g,"");
    }

    function drawBoard (boardSize) {
        let b = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        //white
                        row.push(<div id={j + i * boardSize} className="square white" key={j + i * boardSize}></div>)
                    } 
                    else {
                        //black
                        row.push(<div id={j + i * boardSize} className="square black" key={j + i * boardSize}></div>)
                    }
                }
                else {
                    if (j % 2 === 0) {
                        //black
                        row.push(<div id={j + i * boardSize} className="square black" key={j + i * boardSize}></div>)
                    }
                    else {
                        //white
                        row.push(<div id={j + i * boardSize} className="square white" key={j + i * boardSize}></div>)
                    }
                }
            }
            b.push(row);
        }
        setBoard(b);
    }

    function positionInputValue(length)
     {
        let inputValue = "";
        if(length===0)
         {
            return inputValue;
         }
        for(let i=0;i<length-1;i++)
         {
            inputValue=inputValue + "-1,";
         }
         inputValue=inputValue + "-1";
         return inputValue;
     }

    useEffect(() => {
        drawBoard(size);
        document.getElementById("positionInputBox").value = positionInputValue(size);
        destroyQueens();
    },[size])

    return (
        <div className="home">
            <div className="container">
                <div className="row align-items-center pt-1" id="toprow">
                    <h1>
                        N Queens Problem
                    </h1>
                    <input type="number" placeholder="Number of squares" onChange={(e) => setSize(checkInput(e.target.value))}></input>
                    <form id="positionInputForm">
                        <input id="positionInputBox" name="positionInputBox" placeholder="Position (e.g. -1,-1,0,2)" type="text" ></input>
                        <button type="button" onClick={() => onLoadButtonClick(JSON.parse("[" + document.getElementById("positionInputForm").positionInputBox.value + "]"))} >Load</button>
                    </form>
                </div>
                <div className="row align-items-center justify-content-center" id="warningrow">
                    <Warning isWarning={warningIndicator}/>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row chess">
                    <div style={boardContainerSetWidth}>
                        {board}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NQueens;