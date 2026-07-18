import * as THREE from "https://unpkg.com/three@0.173.0/build/three.module.js";

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
        console.log(gltf);

        scene.add(gltf.scene);
        gltf.scene.traverse(obj =>{
            console.log(obj.name);
            console.log(obj.material);
            
        });

    }

);

const badgeTexture = new THREE.TextureLoader().load(
    "renders/frah25.png"
);
const badgeMaterial = new THREE.MeshBasicMaterial({

    map: badgeTexture,

    transparent: true

});
const badge = new THREE.Mesh(

    new THREE.PlaneGeometry(0.25,0.25),

    badgeMaterial

);
badge.position.set(

    0.18,

    0.55,

    0.07

);
scene.add(badge);
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