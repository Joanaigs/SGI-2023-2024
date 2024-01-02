import * as THREE from 'three';
import { MyReader } from './MyReader.js';
import { MyGame } from './MyGame.js';
import { MyMenu } from './MyMenu.js';
/**
 *  This class contains the contents of out application
 */
class MyGameLogic {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.previousState = null;
        this.myReader = new MyReader(this.app);
        this.waitForReader();
        
    }

    waitForReader() {
        if (!this.myReader.backgroundLoaded) {
            setTimeout(this.waitForReader.bind(this), 100);
            return;
        }
        this.state = "menu";
        this.gameSates();
    }


    gamePlay() {
        //this.app.setActiveCamera("followCar");
        this.game = new MyGame(this, this.myReader.car1, this.myReader.car2, this.myReader.powerUps, this.myReader.obstacles, this.myReader.routes, this.myReader.cutPath, this.myReader.checkpoints);
    }

    gameOver() {
    }

    gameSates() {
        switch (this.state) {
            case "menu":
                this.menu = new MyMenu(this.app);
                this.username = this.menu.input;
                this.difficulty = this.menu.difficulty;
                this.playerCar = this.menu.playerCar;
                this.botCar = this.menu.botCar;
                this.state = "game";
                break;
            case "game":
                this.gamePlay();
                this.game.update();
                break;
            case "gameOver":
                this.game = null;
                this.myReader.reset();
                this.gameOver();
                this.state = "menu";
                break;
        }
    }



    /**
     * Updates the scene
     */
    update() {
        this.myReader.update();
        if (this.previousState != this.state) {
            this.previousState = this.state;
            this.gameSates();

        }
        else if (this.state === "game" && this.game) {
            this.game.update();
        }
    }
}

export { MyGameLogic };