import * as three from 'three'

import { mainCamera } from './camera'
import { UI } from './ui';

import { Plank } from './types';

export class Scene {
    /* base scene elements */
    canvas: HTMLCanvasElement;
    renderer: three.WebGLRenderer;
    scene: three.Scene;

    camera: mainCamera;
    ui: UI;

    planks: Plank[] = [];
    pipe: three.Mesh;
    standA: three.Mesh;
    standB: three.Mesh;
    standC: three.Mesh;

    private static instance: Scene;

    minLength = 0.5;
    maxLength = 20;
    rows = 75;
    maxRows = 200;
    pipeBase = 0.1;

    private constructor() {
        this.canvas = document.querySelector("#mainCanvas")!;
        this.renderer = new three.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.scene = new three.Scene();

        this.renderer.setAnimationLoop(() => { this.render() })

        this.camera = mainCamera.getInstance();
        this.camera.controls.target.set(0, 0, 0);

        this.ui = UI.getInstance();


        const width = 1;
        const rowHeight = 1; //= 0.5;
        const pipeWidth = 0.3;

        this.ui.PARAMS.rows = this.rows;

        this.camera.controls.target.set(0, (this.ui.PARAMS.rows * rowHeight) / 2, 0);
        this.camera.controls.update();

        const pipeGeometry = new three.BoxGeometry(pipeWidth, 1, pipeWidth);
        const pipeMaterial = new three.MeshNormalMaterial();
        this.pipe = new three.Mesh(pipeGeometry, pipeMaterial);
        this.scene.add(this.pipe);

        const standAgeometry = new three.BoxGeometry(7, 0.3, 0.7);
        const standAmaterial = new three.MeshNormalMaterial();
        this.standA = new three.Mesh(standAgeometry, standAmaterial);
        this.scene.add(this.standA);

        const standBgeometry = new three.BoxGeometry(7, 0.3, 0.7);
        const standBmaterial = new three.MeshNormalMaterial();
        this.standB = new three.Mesh(standBgeometry, standBmaterial);
        this.scene.add(this.standB);

        const standCgeometry = new three.BoxGeometry(7, 0.3, 0.7);
        const standCmaterial = new three.MeshNormalMaterial();
        this.standC = new three.Mesh(standCgeometry, standCmaterial);
        this.scene.add(this.standC);

        const loader = new three.TextureLoader();
        const t = loader.load('./240px-Balsa_Wood_Texture.jpg');

        t.wrapS = three.RepeatWrapping;
        t.wrapT = three.RepeatWrapping;

        const material = new three.MeshBasicMaterial({
          map: t,
        });
        
        for (var i = 0; i < this.maxRows; i++) {
            const length = 1
            const geometry = new three.BoxGeometry(length, rowHeight, width);
            //const material = new three.MeshNormalMaterial();
            const plankMesh = new three.Mesh(geometry, material);
            plankMesh.position.set(0, i * rowHeight, 0);
            this.planks.push({ index: i, mesh: plankMesh });
            this.scene.add(plankMesh);
        }
    }

    render = () => {
        this.ui.fpsGraph.begin();

        // update camera if scene resized
        this.camera.ResizeCam(this.canvas, this.renderer);

        this.planks
            .filter(p => p.index < this.ui.PARAMS.rows)
            .forEach(p => {
                (p.mesh.geometry as three.BoxGeometry).setAttribute
                p.mesh.visible = true
            });
        this.planks
            .filter(p => p.index >= this.ui.PARAMS.rows)
            .forEach(p => p.mesh.visible = false);

        this.pipe.position.set(0, (this.ui.PARAMS.rows - (this.pipeBase * this.ui.PARAMS.rows)) / 2, 0);
        //this.pipe.position.set(0, (this.ui.PARAMS.rows * this.ui.PARAMS.height - this.ui.PARAMS.height - (this.pipeBase * this.ui.PARAMS.rows * this.ui.PARAMS.height)) / 2, 0);
        this.pipe.scale.y = this.ui.PARAMS.rows * 1 * (1 + this.pipeBase);

        // this.ui.PARAMS.stand_rotation
        this.standA.position.set(3.5 * Math.cos((1 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3)), -1 * this.pipeBase * this.ui.PARAMS.rows, -3.5 * Math.sin((1 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3)));
        this.standA.rotation.y = (1 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3);
        this.standB.position.set(3.5 * Math.cos((2 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3)), -1 * this.pipeBase * this.ui.PARAMS.rows, -3.5 * Math.sin((2 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3)));
        this.standB.rotation.y = (2 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3);
        this.standC.position.set(3.5 * Math.cos((3 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3)), -1 * this.pipeBase * this.ui.PARAMS.rows, -3.5 * Math.sin((3 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3)));
        this.standC.rotation.y = (3 + (this.ui.PARAMS.stand_rotation * (1 / 120))) * Math.PI * (2 / 3);
        // this.standC.visible = false;

        // update plank position / scale / rotation
        this.planks.forEach(p => p.mesh.scale.x = this.ui.PARAMS.length * (this.maxLength - (((this.maxLength - this.minLength) / this.ui.PARAMS.rows) * p.index)))
        this.planks.forEach(p => p.mesh.scale.z = this.ui.PARAMS.width)
        this.planks.forEach(p => p.mesh.scale.y = this.ui.PARAMS.height)
        this.planks.forEach(p => p.mesh.rotation.y = p.index * (Math.PI / (180 / this.ui.PARAMS.degree)) + Math.round(p.index / (180 / this.ui.PARAMS.degree) - 0.5) * (Math.PI / (180 / this.ui.PARAMS.rotation)));

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
