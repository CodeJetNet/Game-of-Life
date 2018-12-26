import * as PIXI from 'pixi.js';
import * as jQuery from 'jquery';

export default class GameOfLife {

    #app;
    #aliveTexture;
    #deadTexture;
    #cellSize = 32;
    #generations = [];
    #currentGeneration = 0;
    #autoPlay = false;

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

        this.createGrid(this.#generations[this.#currentGeneration]);
        this.setup_jquery();
        window.setInterval(() => this.run(), 500);
    }

    run() {
        if (this.#autoPlay === true) {
            this.nextGeneration();
        }
    }

    setup_jquery() {
        jQuery('#next-generation').on('click', () => this.nextGeneration());
        jQuery('#play').on('click', () => this.enableAutorun());
        jQuery('#stop').on('click', () => this.disableAutorun());
    }

    enableAutorun() {
        this.#autoPlay = true;
    }

    disableAutorun() {
        this.#autoPlay = false;
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
        let neighborCount = this.getNeighborCount(cell);

        if (cell.isDead === true) {
            if (neighborCount === 3) {
                // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                console.log(cell.location + ' dead cell lives. It has 3 neighbors.');
                return true;
            }
        }

        if (cell.isDead === false) {
            if (neighborCount < 2) {
                // Any live cell with fewer than two live neighbors dies, as if by underpopulation.
                console.log(cell.location + ' alive cell dies. It has less than 2 neighbors.');
                return false;
            }

            if (neighborCount > 3) {
                // Any live cell with more than three live neighbors dies, as if by overpopulation.
                console.log(cell.location + ' alive cell dies.  It has more than three neighbors.');
                return false;
            }

            if (neighborCount === 2 || neighborCount === 3) {
                // Any live cell with two or three live neighbors lives on to the next generation.
                console.log(cell.location + ' alive cell lives.  It has 2 or 3 neighbors.');
                return true;
            }
        }

        return false;
    }

    getNeighborCount(cell) {
        let currentGenerationCells = this.#generations[this.#currentGeneration].cells;
        let neighbors = 0;
        console.log(cell.location);
        console.log(this.getNeighborLocations(cell.location));
        for (let location of this.getNeighborLocations(cell.location)) {
            if (this.isCellAlive(currentGenerationCells[location]) === true) {
                console.log(location + ' is alive.');
                neighbors += 1;
            }
        }

        return neighbors;
    }

    getNeighborLocations(location) {
        return [
            location + 1,
            location - 1,
            // location + this.getColumns() - 1,
            location + this.getColumns(),
            location + this.getColumns() + 1,
            location + this.getColumns() + 2,
            location - this.getColumns() - 2,
            location - this.getColumns() - 1,
            location - this.getColumns(),
            // location - this.getColumns() + 1
        ]
    }

    isCellAlive(cell) {
        if (cell === undefined) {
            // This isn't a cell, it can't be alive.
            return false;
        }

        if (cell.isDead === false) {
            return true;
        }

        return false;
    }

    createGrid(generation) {
        generation.cells = [];

        console.log('Columns: ' + this.getColumns());
        console.log('Rows: ' + this.getRows());

        for (let row = 0; row < this.getRows(); row++) {
            for (let column = 0; column < this.getColumns(); column++) {
                let location = row * this.getColumns() + column + row;
                let square = this.createSquare();
                square.x = (column) * this.#cellSize;
                square.y = (row) * this.#cellSize;
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
