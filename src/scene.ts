import * as three from 'three'

import { mainCamera } from './camera'
import { UI } from './ui';

import { UnlitCubes } from './unlit_cubes';

export class Scene {
    /* base scene elements */
    canvas: HTMLCanvasElement;
    renderer: three.WebGLRenderer;
    scene: three.Scene;

    camera: mainCamera;
    ui: UI;

    cubes: three.Mesh[] = [];

    private static instance: Scene;

    private constructor() {
        this.canvas = document.querySelector("#mainCanvas")!;
        this.renderer = new three.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.scene = new three.Scene();

        this.renderer.setAnimationLoop(() => { this.render() })

        this.camera = mainCamera.getInstance();
        this.camera.controls.target.set(0, 0, 0);

        this.ui = UI.getInstance();


        this.ui.PARAMS.rows;
        const rows = 75;
        const minLength = 0.5;
        const maxLength = 20;
        const width = 1;
        const rowHeight = 0.5;
        const pipeScale = 0.1
        const pipeVisibleLength = this.ui.PARAMS.rows * rowHeight * (1 + pipeScale);
        const pipeWidth = 0.3;

        this.camera.controls.target.set(0, (this.ui.PARAMS.rows * rowHeight) / 2, 0);
        this.camera.controls.update();

        const geometry = new three.BoxGeometry(pipeWidth, pipeVisibleLength, pipeWidth);
        const material = new three.MeshNormalMaterial();
        const pipe = new three.Mesh(geometry, material);
        pipe.position.set(0, (this.ui.PARAMS.rows * rowHeight - rowHeight - (pipeScale * this.ui.PARAMS.rows * rowHeight)) / 2, 0);
        this.scene.add(pipe);

        const flat = (index: number): number => 0;
        const lastPlus45 = (index: number): number => i * (Math.PI / 4);
        const lastPlus90 = (index: number): number => i * (Math.PI / 2);
        const lastPlus90Point4 = (index: number): number => i * (Math.PI / 2) + i * (Math.PI / 512);
        const lastPlus45Point4 = (index: number): number => i * (Math.PI / 4) + i * (Math.PI / 256);
        const algo = lastPlus90Point4;

        for (var i = 0; i < this.ui.PARAMS.rows; i++) {
            const length = maxLength - (((maxLength - minLength) / this.ui.PARAMS.rows) * i)
            const geometry = new three.BoxGeometry(length, rowHeight, width);
            const material = new three.MeshNormalMaterial();
            const cube = new three.Mesh(geometry, material);
            cube.position.set(0, i * rowHeight, 0);
            //cube.rotateY(algo(i));
            this.cubes.push({ index: i, cube: cube });
            // if (i == 0 || i == rows - 1) {
            this.scene.add(cube);
            // }
        }
    }

    render = () => {
        this.ui.fpsGraph.begin();

        // update camera if scene resized
        this.camera.ResizeCam(this.canvas, this.renderer);
        this.cubes.forEach(c => c.cube.scale.x = this.ui.PARAMS.length)
        this.cubes.forEach(c => c.cube.scale.z = this.ui.PARAMS.width)
        this.cubes.forEach(c => c.cube.scale.y = this.ui.PARAMS.height)
        this.cubes.forEach(c => c.cube.rotation.y = c.index * (Math.PI / (180 / this.ui.PARAMS.degree)) + Math.round(c.index / (180 / this.ui.PARAMS.degree) - 0.5) * (Math.PI / (180 / this.ui.PARAMS.rotation)));

        this.renderer.render(this.scene, this.camera.mainCam);

        this.ui.fpsGraph.end();
    }

    static getInstance() {
        if (Scene.instance)
            return this.instance;

        this.instance = new Scene();
        return this.instance;
    }
}