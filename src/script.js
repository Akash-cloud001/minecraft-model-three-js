import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

// HELPER FUNCTION
function cloneMeshes(count, model, instructions) {
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const clone = model.clone();
    if ("position" in instructions[i]) {
      clone.position.set(
        instructions[i].position.x,
        instructions[i].position.y,
        instructions[i].position.z
      );
    }
    if ("scale" in instructions[i]) {
      clone.scale.set(
        instructions[i].scale.x,
        instructions[i].scale.y,
        instructions[i].scale.z
      );
    }
    if ("rotation" in instructions[i]) {
      clone.rotation.set(
        instructions[i].rotation.x,
        instructions[i].rotation.y,
        instructions[i].rotation.z
      );
    }
    clone.name = "wall" + i;
    group.add(clone);
  }
  // scene.add(group);
  return group;
}

/**
 * BASE
 */

//DEBUG PANEL
const gui = new dat.GUI();

//CANVAS
const canvas = document.querySelector("canvas.webgl");

//SCENE
const scene = new THREE.Scene();

// MODAL LOADER
const loader = new GLTFLoader();
const lampStyle = [
  {
    position: {
      x: 18,
      y: -2,
      z: 18,
    },
    scale: {
      x: 0.125,
      y: 0.125,
      z: 0.125,
    },
  },
  {
    position: {
      x: -20,
      y: -2,
      z: 18,
    },
    scale: {
      x: 0.125,
      y: 0.125,
      z: 0.125,
    },
  },
  {
    position: {
      x: 18.5,
      y: -2,
      z: -21,
    },
    scale: {
      x: 0.125,
      y: 0.125,
      z: 0.125,
    },
  },
  {
    position: {
      x: -20,
      y: -2,
      z: -20,
    },
    scale: {
      x: 0.125,
      y: 0.125,
      z: 0.125,
    },
  },
];
const wallPosition = [
  { position: { x: -2.25, y: 0.21, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  { position: { x: 2.25, y: 0.21, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  {
    position: { x: 0, y: 0.21, z: -2.5 },
    rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
  },
  {
    position: { x: 0, y: 0.21, z: 2.5 },
    rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
  },
];
//   new THREE.BoxGeometry(0.5, 4, 5),

const redLampPositions = [
    {position: {x:0, y:2.2, z:0,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:-2, y:2.2, z:2.5,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:-2, y:2.2, z:-2.5,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:2, y:2.2, z:-2.5,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:2, y:2.2, z:2.5,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:-2, y:2.2, z:0,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:2, y:2.2, z:0,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:0, y:2.2, z:-2.5,}, scale:{x:0.009, y:0.009, z:0.009}},
    {position: {x:0, y:2.2, z:2.5,}, scale:{x:0.009, y:0.009, z:0.009}}
]
loader.load(
    '/redStone_lamp/scene.gltf', (gltf)=>{
        const redLamp = gltf.scene
        const redLampGroup = cloneMeshes(redLampPositions.length, redLamp, redLampPositions)
        scene.add(redLampGroup)
    }
)

loader.load(
  "/lamp/scene.gltf",
  (gltf) => {
    const lamp = gltf.scene;
    const lampGroup = cloneMeshes(4, lamp, lampStyle);
    scene.add(lampGroup);
  },
  undefined,
  (err) => {
    console.log(err);
  }
);

//TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environment/px.png",
  "/textures/environment/nx.png",
  "/textures/environment/py.png",
  "/textures/environment/ny.png",
  "/textures/environment/pz.png",
  "/textures/environment/nz.png",
]);
scene.background = environmentMapTexture;

const blockTexture = textureLoader.load("/textures/block/7.png");
blockTexture.generateMipmaps = false;
blockTexture.repeat.x = 0.5;
blockTexture.repeat.y = 0.5;
blockTexture.wrapS = THREE.RepeatWrapping;
blockTexture.wrapT = THREE.RepeatWrapping;
blockTexture.magFilter = THREE.NearestFilter;
blockTexture.minFilter = THREE.NearestFilter;
blockTexture.repeat.set(5, 5);

const leftHouseTexture = textureLoader.load("/textures/block/9.png");
leftHouseTexture.generateMipmaps = false;
leftHouseTexture.repeat.x = 0.25;
leftHouseTexture.repeat.y = 0.25;
leftHouseTexture.wrapS = THREE.RepeatWrapping;
leftHouseTexture.wrapT = THREE.RepeatWrapping;
leftHouseTexture.magFilter = THREE.NearestFilter;
leftHouseTexture.minFilter = THREE.NearestFilter;
leftHouseTexture.repeat.set(3,4);

const rightHouseTexture = textureLoader.load("/textures/block/10.png");
rightHouseTexture.generateMipmaps = false;
rightHouseTexture.repeat.x = 0.25;
rightHouseTexture.repeat.y = 0.25;
rightHouseTexture.wrapS = THREE.RepeatWrapping;
rightHouseTexture.wrapT = THREE.RepeatWrapping;
rightHouseTexture.magFilter = THREE.NearestFilter;
rightHouseTexture.minFilter = THREE.NearestFilter;
rightHouseTexture.repeat.set(3,4);


const grassTexture = textureLoader.load("/textures/grass/grass.png");
grassTexture.generateMipmaps = false;
grassTexture.repeat.x = 2;
grassTexture.repeat.y = 2;
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.magFilter = THREE.NearestFilter;
grassTexture.minFilter = THREE.NearestFilter;

// blockTexture.wrapS = THREE.RepeatWrapping
grassTexture.repeat.set(20, 20);

const doorTexture = textureLoader.load("/textures/door/1.png");
const doorBottomTexture = textureLoader.load("/textures/door/2.png");
doorTexture.magFilter = THREE.NearestFilter;
doorTexture.minFilter = THREE.NearestFilter;
doorTexture.repeat.x = 2;
doorTexture.repeat.y = 2;
doorTexture.wrapS = THREE.RepeatWrapping;
doorTexture.wrapT = THREE.RepeatWrapping;
doorBottomTexture.magFilter = THREE.NearestFilter;
doorBottomTexture.minFilter = THREE.NearestFilter;
doorBottomTexture.repeat.x = 2;
doorBottomTexture.repeat.y = 2;
doorBottomTexture.wrapS = THREE.RepeatWrapping;
doorBottomTexture.wrapT = THREE.RepeatWrapping;

//Plane

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(40, 0.5, 40),
  new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.BackSide })
);
floor.geometry.center();
floor.rotation.x = Math.PI;
floor.position.y = -2;
scene.add(floor);

//WALL

const houseGroup = new THREE.Group();
scene.add(houseGroup);

const wall = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 4, 5),
  new THREE.MeshStandardMaterial({ map: blockTexture })
);
const wallGroup = cloneMeshes(4, wall, wallPosition);

//DOOR
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshStandardMaterial({ map: doorTexture })
);
const doorBottom = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshStandardMaterial({ map: doorBottomTexture })
);
door.position.y = -1.3;
door.position.z = 2.751;
doorBottom.position.z = 2.751;
doorBottom.position.y = -0.335;
// gui.add(door.position, 'y').min(-2).max(5).step(0.001).name('doorBase')
// gui.add(doorBottom.position, 'y').min(-2).max(5).step(0.001).name('doorGlass')

// ROOF
const roof = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ map: blockTexture, side: THREE.DoubleSide })
);
const roomFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ map: blockTexture, side: THREE.DoubleSide })
);
roof.rotation.x = Math.PI * 0.5;
roof.position.y = 2.23;
roomFloor.rotation.x = Math.PI * 0.5;
roomFloor.position.y = -1;
houseGroup.add(wallGroup, door, doorBottom, roof, roomFloor);
const leftHouse = houseGroup.clone(true);
const rightHouse = houseGroup.clone(true);
leftHouse.position.x = -3.737;
leftHouse.position.y = -0.474;
// Change the texture of the cloned group's meshes
leftHouse.scale.set(0.5, 0.75, 1);
rightHouse.position.x = 3.737;
rightHouse.position.y = -0.474;
rightHouse.scale.set(0.5, 0.75, 1);
leftHouse.traverse((child) => {
    if (child.isMesh) {
        child.material = child.material.clone(); // Clone the material to avoid sharing the original material
        if (child.geometry.type === 'BoxGeometry') {
            // Change texture of specific meshes (e.g., only box meshes)
            child.material.map = leftHouseTexture;
        } 
    }
});
rightHouse.traverse((child) => {
    if (child.isMesh) {
        child.material = child.material.clone(); // Clone the material to avoid sharing the original material
        if (child.geometry.type === 'BoxGeometry') {
            // Change texture of specific meshes (e.g., only box meshes)
            child.material.map = rightHouseTexture;
        } 
    }
});
scene.add(leftHouse, rightHouse);
// gui.add(rightHouse.position, 'y').min(-1).max(4).step(0.001)
// gui.add(rightHouse.position, 'x').min(0).max(5).step(0.001)
// LIGHTS
const ambientLight = new THREE.AmbientLight("#fff", 0.5);
scene.add(ambientLight);

// SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// RESIZE EVENT
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 5;
camera.position.y = 8;
camera.position.z = 5;
scene.add(camera);

//CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.maxPolarAngle = Math.PI * .5;
controls.maxDistance = 15;
// controls.minDistance = 5

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ANIMATE
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update controls
  controls.update();

  //render
  renderer.render(scene, camera);

  //call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
