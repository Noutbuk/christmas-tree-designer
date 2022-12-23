import * as three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class mainCamera {
    camera: three.PerspectiveCamera;
    controls: OrbitControls;

    private static instance: mainCamera;

    private constructor() {
        /* These defaults are a good average for most use cases */
        this.camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 40;

        this.controls = new OrbitControls(this.camera, document.getElementById('content')!);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    get mainCam() {
        return this.camera;
    }

    resetCamera = () => {
        this.controls.reset();
    }

    // called if the window is resized
    ResizeCam = (canvas: HTMLCanvasElement, renderer: three.WebGLRenderer) => {
        if (this.checkResize(canvas, renderer)) {
            const resizedCanvas = renderer.domElement;
            this.camera.aspect = resizedCanvas.clientWidth / resizedCanvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
    }

    private checkResize = (canvas: HTMLCanvasElement, renderer: three.WebGLRenderer) => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
    
        if (needResize)
            renderer.setSize(width, height, false);
    
        return needResize;
    }

    static getInstance() {
        if (mainCamera.instance)
            return this.instance;

        this.instance = new mainCamera();
        return this.instance;
    }
}