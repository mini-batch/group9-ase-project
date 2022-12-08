
// Option 2: Import just the parts you need.
import {
    Scene, PerspectiveCamera, AmbientLight, PointLightHelper, WebGLRenderer, PointLight,
    SphereGeometry, MeshPhongMaterial, Mesh, PlaneGeometry, Color, PCFSoftShadowMap, Raycaster, Vector2, Vector3, RectAreaLight
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { setSphereColor, worker } from './PolyPyramidUI';
const scene = new Scene();
const camera = new PerspectiveCamera();
scene.background = new Color(0x333333);
const globalLight = new AmbientLight(0xeeeeee);
scene.add(globalLight);
const light = new PointLight(0xffffff, 1, 100);
light.castShadow = true;
const helper = new PointLightHelper(light, 2);
scene.add(light);
scene.add(helper);
// light.lookAt(0, 0, 0);
light.intensity = 1;
light.position.set(0, 0, 1).normalize();
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
let resizeObeserver;

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

export function initScene(canvas) {
    camera.fov = 45;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.near = 0.2;
    camera.far = 300;
    //camera.45, canvas.clientWidth / canvas.clientHeight, 0.2, 300);
    camera.position.z = 4;
    camera.position.y = 4;
    camera.addEventListener('onCameraChange', (e) => {
        console.log('change');
    })
    renderer.setSize(canvas.clientWidth, canvas.clientWidth);
    resizeObeserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientWidth);
        })
    });
    resizeObeserver.observe(canvas);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxDistance = 300;

    controls.target = new Vector3(5, 3.8, 5);
    controls.maxPolarAngle = Math.PI / 2;

    

    const raycaster = new Raycaster();
    const pointer = new Vector2();
    function onClick(event) {
        pointer.x = ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1;
        pointer.y = - ((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        let shape = document.getElementById("inputShape").value
        const intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.visible === true) {
                if (intersects[i].object.name[0] === "s") {
                    intersects[i].object.material.color.set(Colours[shape]);
                    //setSphereColor(0,0,0, Colours[shape]);
                    break;
                }
            }
        }
    }

    window.addEventListener('click', onClick);

    function animate() {        
        renderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(animate);
    }

    canvas.appendChild(renderer.domElement);

    // 创建一个地面
    const meshfloor = new Mesh(
        new PlaneGeometry(130, 130, 10, 10),
        new MeshPhongMaterial({
            color: 0x1B5E20,
            wireframe: false
        })
    )
    meshfloor.rotation.x -= Math.PI / 2;
    // 地面同样设置去接受光源
    meshfloor.receiveShadow = true;

    // 将所有创建的物体加入到场景中去
    scene.add(meshfloor);
    light.position.set(4, 20, 4);

    animate();
}

function createSphere(x, y, z, color, radius, segs) {
    let mat = new MeshPhongMaterial({
        color: color,
        specular: color,
        shininess: 30
    });
    mat.castShadow = true;
    mat.receiveShadow = true;
    let sphere = new Mesh(new SphereGeometry(radius, segs, segs), mat);
    sphere.position.set(x, z, y);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.name = ["s", x, y, z].join(",");
    console.log(sphere.name);

    return sphere;
}

function disposeSphere(instance) {
    scene.remove(instance);
    instance.material.dispose();
    instance.dispose();
}

export default class {
    createSphere(x, y, z, color, radius = 1, segs = 15) {
        return createSphere(x, y, z, color, radius, segs);
    }

    disposeSphere(sphere) {
        disposeSphere(sphere);
    }

    add(obj) {
        scene.add(obj);
    }

    init(dom) {
        initScene(dom);
    }

    dispose() {
        resizeObeserver.disconnect();
        cancelAnimationFrame();
    }
};
