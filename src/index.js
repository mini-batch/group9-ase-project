import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {
    Navigation,
    NQueens,
    Home
} from "./components"
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Navigation />
        <Routes>
            <Route path="/group9-ase-project" element={<Home />} />
            <Route path="/n-queens-problem" element={<NQueens />} />
        </Routes>
    </Router>
);
