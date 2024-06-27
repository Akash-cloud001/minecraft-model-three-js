import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'lil-gui'

/**
 * BASE
 */

//DEBUG PANEL
const gui = new dat.GUI();

//CANVAS
const canvas = document.querySelector('canvas.webgl');

//SCENE
const scene = new THREE.Scene();

// MODAL LOADER
const loader = new GLTFLoader();
console.log(loader)
const lampStyle=[
    {
        position:{
            x:18,
            y:-2,
            z:18,
        },
        scale:{
            x:0.125,
            y:0.125,
            z:0.125,
        }
    },
    {
        position:{
            x:-20,
            y:-2,
            z:18,
        },
        scale:{
            x:0.125,
            y:0.125,
            z:0.125,
        }
    },
    {
        position:{
            x:18.5,
            y:-2,
            z:-21,
        },
        scale:{
            x:0.125,
            y:0.125,
            z:0.125,
        }
    },
    {
        position:{
            x:-20,
            y:-2,
            z:-20,
        },
        scale:{
            x:0.125,
            y:0.125,
            z:0.125,
        }
    }
]
loader.load('/lamp/scene.gltf',(gltf)=>{
    const lamp = gltf.scene;
    for(let i=0; i<4; i++){
        const clone = lamp.clone();
        clone.position.set(lampStyle[i].position.x,lampStyle[i].position.y, lampStyle[i].position.z)
        clone.scale.set(lampStyle[i].scale.x,lampStyle[i].scale.y, lampStyle[i].scale.z)
        scene.add(clone)
        console.log(clone)
    }
}, undefined, (err)=>{
    console.log(err)
})

//TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environment/px.png',
    '/textures/environment/nx.png',
    '/textures/environment/py.png',
    '/textures/environment/ny.png',
    '/textures/environment/pz.png',
    '/textures/environment/nz.png',
])
scene.background = environmentMapTexture;

const blockTexture = textureLoader.load('/textures/block/5.png')
blockTexture.generateMipmaps = false
blockTexture.repeat.x=1
blockTexture.repeat.y=1
blockTexture.wrapS = THREE.RepeatWrapping
blockTexture.wrapT = THREE.RepeatWrapping
blockTexture.magFilter = THREE.NearestFilter
blockTexture.minFilter = THREE.NearestFilter

const grassTexture = textureLoader.load('/textures/grass/grass.png');
grassTexture.generateMipmaps = false
grassTexture.repeat.x=2
grassTexture.repeat.y=2
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping
grassTexture.magFilter = THREE.NearestFilter
grassTexture.minFilter = THREE.NearestFilter

// blockTexture.wrapS = THREE.RepeatWrapping
grassTexture.repeat.set(20, 20);

//Plane

const floor = new THREE.Mesh(
    new THREE.BoxGeometry(40,0.5,40),
    new THREE.MeshStandardMaterial({map:grassTexture, side: THREE.BackSide})
)
floor.geometry.center()
floor.rotation.x = Math.PI  
floor.position.y = -2
scene.add(floor)

//BOX 
const brick = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({color:'#0ff'})
)
scene.add(brick)

// LIGHTS
const ambientLight = new THREE.AmbientLight(
    '#fff',
    0.5
)
scene.add(ambientLight)



















// SIZES
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// RESIZE EVENT
window.addEventListener('resize', ()=>{
    
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
 
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

// CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 8
camera.position.z = 5
scene.add(camera)

//CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.maxPolarAngle = Math.PI * .5;
controls.maxDistance = 15
// controls.minDistance = 5

const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ANIMATE
const clock = new THREE.Clock()
const tick = ()=>{
    const elapsedTime = clock.getElapsedTime()

    //update controls
    controls.update()

    //render
    renderer.render(scene, camera)

    //call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()