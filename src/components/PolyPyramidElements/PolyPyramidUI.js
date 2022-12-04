import React, { useEffect, useState, useRef, createRef } from "react";
import "./PolyPyramidUI.css";
import Scene from "./PolyPyramidScene"
import Pyramid from './Pyramid'


// 创建一个五层金字塔
let worker = new Pyramid(5, 1);
const scene = new Scene();



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

class PolyPyramid extends React.Component {
    constructor(props) {
        super(props);

        this.panel = createRef();
    }


    componentDidMount() {
        scene.init(this.panel.current);
        renderPyramid();

        // 第五层的第 x, y 个球变成 0xee1166
        worker.getLayer(5).set(0, 0, 0xee1166)
        worker.getLayer(1).set(0, 0, 0x7788ff)
        worker.getLayer(3).set(2, 1, 0x88ffcc)
        worker.getLayer(4).set(0, 1, 0x88cfcc)
        worker.getLayer(4).set(1, 3, 0xffffcc)
        // 渲染金字塔
        renderPyramid();
    }

    componentWillUnmount() {
        scene.dispose();
    }


    render() {
        return (
            <div>
                <div className="container">
                    <div ref={this.panel} className="panel">
                    </div>
                </div>

                <input id="l1" type="checkbox" value={true} defaultChecked
                    onChange={(e) => layerVisible(1, e.target.checked)} />
                <label htmlFor="l1">1</label>
                <input id="l2" type="checkbox" value={true} defaultChecked
                    onChange={(e) => layerVisible(2, e.target.checked)} />
                <label htmlFor="l2">2</label>
                <input id="l3" type="checkbox" value={true} defaultChecked
                    onChange={(e) => layerVisible(3, e.target.checked)} />
                <label htmlFor="l3">3</label>
                <input id="l4" type="checkbox" value={true} defaultChecked
                    onChange={(e) => layerVisible(4, e.target.checked)} />
                <label htmlFor="l4">4</label>
                <input id="l5" type="checkbox" value={true} defaultChecked
                    onChange={(e) => layerVisible(5, e.target.checked)} />
                <label htmlFor="l5">5</label>
            </div>
        )
    }
}

export default PolyPyramid;