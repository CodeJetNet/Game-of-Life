import * as PIXI from 'pixi.js'

export default class GameOfLife {

    #app;
    #buttons = [];

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
            .add("images/tileset.png")
            .load(() => this.setup());
    }

    setup() {
        this.createGrid();
    }

    getAliveTexture() {
        let aliveSprite = PIXI.utils.TextureCache["images/tileset.png"];
        aliveSprite.frame = new PIXI.Rectangle(64, 0, 64, 64);

        return aliveSprite;
    }

    getDeadTexture() {
        let texture = PIXI.utils.TextureCache["images/tileset.png"];
        texture.frame = new PIXI.Rectangle(0, 0, 64, 64);

        return texture;
    }

    createGrid() {
        for (let i = 0; i * 64 < window.innerWidth; i++) {
            this.#buttons[i] = new PIXI.Sprite(this.getDeadTexture());
            this.#buttons[i].buttonMode = true;

            // button.anchor.set(0.5);
            this.#buttons[i].x = i * 64;
            this.#buttons[i].y = 0;

            // make the button interactive...
            this.#buttons[i].interactive = true;
            this.#buttons[i].buttonMode = true;

            this.#buttons[i]
                .on('pointerdown', this.makeAlive(i))
                .on('pointerup', this.makeDead(i))
                .on('pointerover', () => this.makeAlive(i))
                .on('pointerout', () => this.makeDead(i));

            this.#app.stage.addChild(this.#buttons[i]);
        }
    }

    makeDead(button_coordinate) {
        console.log(button_coordinate);
        this.#buttons[button_coordinate].texture = this.getDeadTexture();
    }

    makeAlive(button_coordinate) {
        this.#buttons[button_coordinate].texture = this.getAliveTexture();
    }
}
