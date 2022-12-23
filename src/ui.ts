import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { mainCamera } from './camera';

/* Small class that uses tweakpane for UI */

export class UI {
    pane = new Pane();
    fpsGraph: any;

    PARAMS = {
        rows: 50,
        length: 1,
        width: 1,
        height: 1,
        degree: 360,
        rotation: 360,
    };

    private static instance: UI;
    private constructor() {
        const cam = mainCamera.getInstance();
        this.pane.registerPlugin(EssentialsPlugin);

        this.fpsGraph = this.pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            lineCount: 2,
        });

        this.pane.addMonitor(cam.camera.position, 'x', { interval: 20 });
        this.pane.addMonitor(cam.camera.position, 'y', { interval: 20 });
        this.pane.addMonitor(cam.camera.position, 'z', { interval: 20 });

        const tree = this.pane.addFolder({
            title: 'tree',
            expanded: true,
          });

        tree.addInput(this.PARAMS, 'rows', {
            min: 0,
            max: 100,
        });
        tree.addInput(this.PARAMS, 'length', {
            min: 0,
            max: 10,
        });
        tree.addInput(this.PARAMS, 'width', {
            min: 0,
            max: 10,
        });
        tree.addInput(this.PARAMS, 'height', {
            min: 0,
            max: 10,
        });
        tree.addInput(this.PARAMS, 'degree', {
            min: 1,
            max: 360,
        });
        tree.addInput(this.PARAMS, 'rotation', {
            min: 1,
            max: 360,
        });
    }

    static getInstance() {
        if (UI.instance)
            return this.instance;

        this.instance = new UI();
        return this.instance;
    }
}