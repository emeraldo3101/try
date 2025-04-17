import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

// div from page
const container = document.getElementById( 'canvas' );
document.body.appendChild( container );

// setting up the scene //
const renderer = new THREE.WebGLRenderer({ antialias:true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight); // or renderer.setSize(500, 300); this resives window three.js content is in// 
//also it seems like if in this renderer.setSize(window.innerWidth, window.innerHeight) format, whenever i change window size and refresh page, changes to that window size so isnt cut//
container.appendChild( renderer.domElement );
renderer.setClearColor(0xE8E8E8); //sets colour of background
renderer.setPixelRatio(window.devicePixelRatio)

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
 //camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window. innerHeight, 1, 1000);
camera.position.set(20, 10, 20); // sets camera postion
//camera. lookAt(0, 0, 0); //centers camera to object can be deleted if using caera target (see below)

//controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // gives smooth rotation
controls.enablePan = false; // false so object always stays centered within view
controls.minDistance = 5; //min zoom distance
controls.maxDistance = 20; //max zoom distance
controls.minPolarAngle = 0.5; //how high user can tilt camera
controls.maxPolarAngle = 1.5; //how low user can tilt camera
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0); //set target from where camera is looking at
controls.update(); //applies update

const groundGeometry = new THREE.PlaneGeometry(15, 15, 15, 15);
groundGeometry.rotateX(-Math.PI / 2); // rotates plane
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x30D5C0, //changes colour of shadow, number after 0x is hex code//
    side: THREE.DoubleSide
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false; 
groundMesh.recieveShadow = true; 
//scene.add(groundMesh); // plane/ground 

// adds spotlight to scene! //
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.4, 0.4);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001; //softens shadow spotlight so nnoo glitchy shadows on thicc model
scene.add(spotLight);

const loader = new GLTFLoader().setPath('public/');
loader.load('emerald_flowerflat.glb', (gltf) => {
    console.log('loading model');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.recieveShadow = true;
        }
    });

    mesh.position.set(-0.1, 3, 1); // sets position of gltf x, y, z
    scene.add(mesh);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update(); //controls
    renderer.render(scene, camera);
}

animate();




//watercolour effect//
const root = document.querySelector('html')

// Real cursor element
const cursor = document.createElement('div')
cursor.classList.add('cursor')
root.appendChild(cursor)


  
  function setPosition(element, e) {
    element.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
  }

// create a random number between the given range of 'MIN' and 'MAX'
function randomRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

root.addEventListener("mousemove", (e) => {
    //set position for cursor
    setPosition(cursor, e)

    // Create a new trail element
    const trail = document.createElement("div");
    trail.classList.add("cursor-trail");

    document.body.appendChild(trail);

    // Generate random size and color
    const size = Math.random() * 50 + 50;
    const colors = [
        "rgba(0, 217, 255, 0.1)", // rly blue
        "rgba(0, 255, 255, 0.1)", // aqua
        "rgba(53, 202, 255, 0.1)", // blue
        "rgba(117, 255, 248, 0.1)", // bluer aqua
        "rgba(255, 242, 0, 0.1)"  // Soft purple
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Apply styles to the trail element
    trail.style.width = `${size}px`;
    trail.style.height = `${size}px`;
    trail.style.background = `radial-gradient(circle, ${color}, rgba(255, 255, 255, 0))`;
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
    trail.style.transform = `translate(-50%, -50%) scale(${randomRange(4, 5)})`;
    // Math.random() * 3 + 2

    // Fade out and remove
    setTimeout(() => {
        trail.style.opacity = "0";
        setTimeout(() => {
            trail.remove();
        }, 800);
    }, 50);
});