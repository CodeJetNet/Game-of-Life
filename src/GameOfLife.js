import * as PIXI from 'pixi.js';
import * as jQuery from 'jquery';

export default class GameOfLife {

    #app;
    #aliveTexture;
    #deadTexture;
    #cellSize = 32;
    #generations = [];
    #currentGeneration = 0;

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
        this.#app.renderer.resize(window.innerWidth, window.innerHeight - 100);

        this.#generations[this.#currentGeneration] = new PIXI.Container();

        this.#app.stage.addChild(this.#generations[this.#currentGeneration]);

        document.body.appendChild(this.#app.view);

        PIXI.loader
            .add("images/alive.png")
            .add("images/dead.png")
            .load(() => this.setup());
    }

    setup() {
        this.#deadTexture = PIXI.utils.TextureCache["images/dead.png"];
        this.#aliveTexture = PIXI.utils.TextureCache["images/alive.png"];

        this.createGrid(this.#generations[0]);
        this.setup_jquery();
    }

    setup_jquery() {
        jQuery('#next-generation').on('click', () => this.nextGeneration())
    }

    nextGeneration() {
        let nextGeneration = this.#currentGeneration + 1;

        this.#generations[nextGeneration] = new PIXI.Container();
        this.#app.stage.addChild(this.#generations[nextGeneration]);
        this.populateNextGeneration();
        this.#generations[this.#currentGeneration].visible = false;
        this.#generations[nextGeneration].visible = true;
        this.#currentGeneration = nextGeneration;
    }

    populateNextGeneration() {
        let nextGeneration = this.#generations[this.#currentGeneration + 1];
        this.createGrid(nextGeneration);

        let currentGenerationCells = this.#generations[this.#currentGeneration].cells;
        let nextGenerationCells = nextGeneration.cells;

        for (let cell of currentGenerationCells) {
            if (cell !== undefined) {
                if (this.cellLivesToNextGen(cell)) {
                    this.makeAlive(nextGenerationCells[cell.location]);
                }
            }
        }
    }

    cellLivesToNextGen(cell) {
        if (this.cellHasLessThanTwoNeighbors(cell)) {
            return false;
        }

        return true;
    }

    cellHasLessThanTwoNeighbors(cell) {
        let currentGenerationCells = this.#generations[this.#currentGeneration].cells;
        let neighbors = 0;

        if (this.isCellAlive(currentGenerationCells[cell.location + 1]) === true) {
            neighbors += 1;
        }

        if (this.isCellAlive(currentGenerationCells[cell.location + 1]) === true) {
            neighbors += 1;
        }

        if (this.isCellAlive(currentGenerationCells[cell.location - 1]) === true) {
            neighbors += 1;
        }

        if (neighbors < 2) {
            return true;
        }

        return false;
    }

    getNeighborLocations(location) {
        return [
            location + 1,
            location - 1,
            location + this.getColumns() - 1,
            location + this.getColumns(),
            location + this.getColumns() + 1,
            location - this.getColumns() - 1,
            location - this.getColumns(),
            location - this.getColumns() + 1
        ]
    }

    isCellAlive(cell) {
        if (cell === undefined) {
            // This isn't a cell, it can't be alive.
            return false;
        }

        if (cell.isDead === true) {
            return false;
        }

        return true;
    }

    createGrid(generation) {
        generation.cells = [];

        for (let row = 1; row < this.getRows(); row++) {
            for (let column = 1; column < this.getColumns(); column++) {
                let location = row * this.getColumns() + column + row;
                let square = this.createSquare();
                square.x = (column - 1) * this.#cellSize;
                square.y = (row - 1) * this.#cellSize;
                square.location = location;
                square.on('pointerdown', () => this.toggle(location));

                generation.cells[location] = square;
                generation.addChild(square);
            }
        }
    }

    createSquare() {
        let square = new PIXI.Sprite(this.#deadTexture);

        square.height = this.#cellSize;
        square.width = this.#cellSize;
        square.buttonMode = true;
        square.interactive = true;
        square.buttonMode = true;
        square.isDead = true;

        return square;
    }

    toggle(location) {
        let cell = this.#generations[this.#currentGeneration].cells[location];

        if (cell.isDead === true) {
            this.makeAlive(cell);
            return;
        }

        this.makeDead(cell);
    }

    makeDead(cell) {
        cell.texture = this.#deadTexture;
        cell.isDead = true;
    }

    makeAlive(cell) {
        cell.texture = this.#aliveTexture;
        cell.isDead = false;
    }

    getGameWidth() {
        return this.#app.renderer.width;
    }

    getGameHeight() {
        return this.#app.renderer.height;
    }

    getColumns() {
        return Math.floor(this.getGameWidth() / this.#cellSize);
    }

    getRows() {
        return Math.floor(this.getGameHeight() / this.#cellSize);
    }
}
