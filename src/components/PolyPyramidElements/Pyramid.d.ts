interface Sphere {
    color: number;
    pos: number[];
    userData?: any;
}

class PyramidLayer {
    // size is layer id
    readonly size: number;
    readonly matrix: Sphere[][];
    /**
     * 
     * @param matrix color matrix
     * [
     * [0xffffaa, 0xffaabb, 0xffaacc], 
     * [0xffffaa, 0xffaabb, 0xffaacc], 
     * [0xffffaa, 0xffaabb, 0xffaacc]
     * ]
     */
    fill(matrix: [][]): void;
    set(x: number, y: number, color: number): void;
    get(x: number, y: number): Sphere;
}

class Pyramid {
    readonly layers: PyramidLayer[];
    constructor(layersNum: number, sphereRadius = 1);
    radius(): number;
    // 1 - n
    getLayer(layer: number): PyramidLayer;
    get(layer: number, x: number, y: number): number;
}

export default Pyramid;

export { PyramidLayer, Sphere }