import * as PIXI from 'pixi.js'

export default class GameOfLife {

    #app;

    constructor() {
        this.#app = new PIXI.Application(
            {
                width: 256,         // default: 800
                height: 256,        // default: 600
                antialias: true,    // default: false
                transparent: false, // default: false
                resolution: 1       // default: 1
            }
        );

        document.body.appendChild(this.#app.view);

        PIXI.loader
            .add("images/tileset.png")
            .load(() => {
                this.setup();
            });
    }

    setup() {
        let texture = PIXI.utils.TextureCache['images/tileset.png'];

        //Tell the texture to use that rectangular section
        texture.frame = new PIXI.Rectangle(192, 128, 64, 64);

        //Create the sprite from the texture
        let rocket = new PIXI.Sprite(texture);

        //Position the rocket sprite on the canvas
        rocket.x = 32;
        rocket.y = 32;

        //Add the rocket to the stage
        this.#app.stage.addChild(rocket);

        //Render the stage
        this.#app.renderer.render(this.#app.stage);
    }
}
