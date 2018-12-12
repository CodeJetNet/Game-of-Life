import * as PIXI from 'pixi.js'

export default class GameOfLife {

    #app;

    constructor() {
        this.#app = new PIXI.Application(
            {
                antialias: true,    // default: false
                transparent: false, // default: false
                resolution: 1       // default: 1
            }
        );

        this.#app.renderer.view.style.position = "absolute";
        this.#app.renderer.view.style.display = "block";
        this.#app.renderer.autoResize = true;
        this.#app.renderer.resize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.#app.view);

        this.createGrid();
    }

    createGrid() {
        let magnification = 20;

        for (var i = 0; i * magnification < window.innerWidth; i++) {
            let gap = i * magnification;

            let horizontalLine = new PIXI.Graphics();
            horizontalLine.lineStyle(1, 0xFFFFFF, 1);
            horizontalLine.moveTo(0, gap);
            horizontalLine.lineTo(window.innerWidth, gap);
            this.#app.stage.addChild(horizontalLine);

            let verticalLine = new PIXI.Graphics();
            verticalLine.lineStyle(1, 0xFFFFFF, 1);
            verticalLine.moveTo(gap, 0);
            verticalLine.lineTo(gap, window.innerHeight);
            this.#app.stage.addChild(verticalLine);
        }

        //Render the stage
        this.#app.renderer.render(this.#app.stage);
    }
}
