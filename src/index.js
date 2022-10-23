import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes} from "react-router-dom";
import {
    Navigation,
    NQueens,
    Home,
    Polysphere
} from "./components"
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Navigation />
        <Routes>
            <Route path={process.env.PUBLIC_URL + '/polysphere-puzzle'} element={<Polysphere />} />
            <Route path={process.env.PUBLIC_URL + '/n-queens-problem'} element={<NQueens />} />
            <Route path={process.env.PUBLIC_URL + '/'} element={<Home />} />
        </Routes>
    </Router>
);
