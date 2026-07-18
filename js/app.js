import * as THREE from "https://unpkg.com/three@0.169.0/build/three.module.js";

import { GLTFLoader }
from "https://unpkg.com/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";

import { OrbitControls }
from "https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js";


// Renderer

const renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha:true
});

renderer.setSize(window.innerWidth,window.innerHeight);

renderer.outputColorSpace = THREE.SRGBColorSpace;

document
.getElementById("viewer")
.appendChild(renderer.domElement);


// Scene

const scene = new THREE.Scene();


// Kamera

const camera = new THREE.PerspectiveCamera(

    35,

    window.innerWidth/window.innerHeight,

    0.1,

    100

);

camera.position.set(0,1.3,3);


// Controls

const controls = new OrbitControls(camera,renderer.domElement);

controls.enableDamping = true;


// Licht

scene.add(new THREE.AmbientLight(0xffffff,1));

const light = new THREE.DirectionalLight(0xffffff,3);

light.position.set(3,5,4);

scene.add(light);


// Modell laden

const loader = new GLTFLoader();

loader.load(

    "models/jersey.glb",

    (gltf)=>{

        scene.add(gltf.scene);

    }

);


// Animation

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();


// Resize

window.addEventListener("resize",()=>{

    camera.aspect = window.innerWidth/window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);

});