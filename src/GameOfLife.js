import * as PIXI from 'pixi.js'

export default class GameOfLife {

    #app;
    #buttons = [];
    #aliveTexture;
    #deadTexture;

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

        PIXI.loader
            .add("images/alive.png")
            .add("images/dead.png")
            .load(() => this.setup());
    }

    setup() {
        this.#deadTexture = PIXI.utils.TextureCache["images/dead.png"];
        this.#aliveTexture = PIXI.utils.TextureCache["images/alive.png"];

        this.createGrid();
    }

    createGrid() {
        let grid_size = 64;

        let columns = (window.innerWidth / grid_size) - 1;
        let rows = (window.innerHeight / grid_size) - 1;

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {

                let location = row * columns + column + row;

                this.#buttons[location] = new PIXI.Sprite(this.#deadTexture);

                this.#buttons[location].x = column * grid_size;
                this.#buttons[location].y = row * grid_size;

                this.#buttons[location].buttonMode = true;
                this.#buttons[location].interactive = true;
                this.#buttons[location].buttonMode = true;

                this.#buttons[location]
                //     .on('pointerdown', this.makeAlive(i))
                //     .on('pointerup', this.makeDead(i))
                    .on('pointerover', () => this.makeAlive(location))
                    .on('pointerout', () => this.makeDead(location));

                this.#app.stage.addChild(this.#buttons[location]);
            }
        }
    }

    makeDead(i) {
        this.#buttons[i].texture = this.#deadTexture;
    }

    makeAlive(i) {
        this.#buttons[i].texture = this.#aliveTexture;
    }
}
