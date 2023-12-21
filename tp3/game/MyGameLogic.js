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
        this.state = "game";
        this.myReader = new MyReader(this.app);
        this.gameSates();
        
    }

    menu(){

    }

    gamePlay(){
        this.game = new MyGame(this.app, this.myReader.car1, this.myReader.car2, this.myReader.powerUps, this.myReader.obstacles, this.myReader.routes, this.myReader.cutPath);
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
                    this.gameOver();
                    this.state = "menu";
                    break;
            }
        }
    


    /**
     * Updates the scene
     */
    update() {
        switch(this.state){
            case "game":
                this.game.update();
                break;

        }


        
    }
}

export { MyGameLogic };