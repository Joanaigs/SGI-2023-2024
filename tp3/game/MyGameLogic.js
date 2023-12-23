import * as THREE from 'three';
import { MyReader } from './MyReader.js';
import { MyGame } from './MyGame.js';
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
        this.state = "menu";
        this.previousState = null;
        this.myReader = new MyReader(this.app);
        this.gameSates();
        
    }

    menu(){

    }

    gamePlay(){
        this.game = new MyGame(this, this.myReader.car1, this.myReader.car2, this.myReader.powerUps, this.myReader.obstacles, this.myReader.routes, this.myReader.cutPath, this.myReader.checkpoints);
    }

    gameOver(){
    }

    gameSates(){
            switch(this.state){
                case "menu":
                    this.menu();
                    this.state = "game";
                    break;
                case "game":
                    this.gamePlay();
                    break;
                case "gameOver":
                    this.game=null;
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
        if(this.state === "game" && this.game){
            this.game.update();
        }
        if(this.previousState != this.state){
            this.previousState = this.state;
            this.gameSates();

        }
    }
}

export { MyGameLogic };