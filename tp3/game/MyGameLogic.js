import * as THREE from 'three';
import { MyReader } from './MyReader.js';
import { MyGame } from './MyGame.js';
import { MyMenu } from './MyMenu.js';
import { MyVehicleObject } from './MyVehicleObject.js';
import { MyFinal} from './MyFinal.js';

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
        this.username = "";
        this.difficulty;
        this.playerCar = null;
        this.botCar = null;        
    }

    waitForReader() {
        if (!this.myReader.backgroundLoaded) {
            setTimeout(this.waitForReader.bind(this), 100);
            return;
        }
        //this.state = "menu";
        this.state = "gameOver";
        this.gameSates();
    }


    gamePlay() {
        this.app.setActiveCamera("followCar");
        let difficult;
        switch (this.difficulty) {
            case "easy":
                difficult = 0.5;
                break;
            case "medium":
                difficult = 0.7;
                break;
            case "hard":
                difficult = 0.9;
                break;
        }
        let car = new MyVehicleObject(this.playerCar, false);
        let enemyCar = new MyVehicleObject(this.botCar, false);
        this.game = new MyGame(this, car, enemyCar, this.myReader.powerUps, this.myReader.obstacles, this.myReader.routes, this.myReader.cutPath, this.myReader.checkpoints, this.myReader.track2, difficult);
    }

    gameOver() {
    }

    gameSates() {
        switch (this.state) {
            case "menu":
                if(this.game)
                    this.game.reset();
                this.app.setActiveCamera("menu")
                this.menu = new MyMenu(this);
                break;
            case "game":
                this.gamePlay();
                this.game.update();
                break;
            case "gameOver":
                this.game.reset();
                this.game = null;
                /*
                this.winnerCar = this.game.winner;
                this.loserCar = this.game.loser;
                this.loser = this.car;
                this.loserTime = this.car.gameTime;
                this.loserName = "player"
                this.winner = this.automaticVehicle;
                this.winnerTime = this.automaticVehicle;
                this.winnerName = "BOT"


                */
                this.winnerCar = new MyVehicleObject("pinkTruck");
                this.winnerCar.position.set(-1960, 230, -3000);
                this.loserCar = new MyVehicleObject("cyanTruck");
                this.loserCar.position.set(-1980, 230, -3000);
                this.app.scene.add(this.winnerCar, this.loserCar);

                this.final = new MyFinal(this);
                this.myReader.reset();
                
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
        else if(this.state == "gameOver" && this.final){
            this.winnerCar.rotation.y += 0.02;
            this.final.update();
        }
    }
}

export { MyGameLogic };