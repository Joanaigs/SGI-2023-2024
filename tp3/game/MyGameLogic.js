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
        this.state = "menu";
        this.gameStates();
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


    backToMenu(){
        this.game.reset();
        this.state = "menu"
        this.gameStates();
    }

    gameStates() {
        switch (this.state) {
            case "menu":
                this.final=null;
                if(this.winnerCar && this.loserCar)
                this.app.scene.remove(this.winnerCar, this.loserCar);
                if(this.game){
                    this.game.reset();
                    this.game = null;
                    this.myReader.reset();
                }
                this.app.setActiveCamera("menu")
                this.menu = new MyMenu(this);
                break;
            case "game":
                this.final = null;
                if(this.winnerCar && this.loserCar)
                    this.app.scene.remove(this.winnerCar, this.loserCar);
                this.gamePlay();
                this.game.update();
                break;
            case "gameOver":
                this.app.setActiveCamera("final")
                this.winnerCar = this.game.winner.clone();
                this.winnerCar.position.set(-1960, 230, -3000);
                this.loserCar = this.game.loser.clone();
                this.loserCar.position.set(-1980, 230, -3000);
                this.app.scene.add(this.winnerCar, this.loserCar);

                if(this.winnerCar == this.car){
                    this.winnerName = this.input;
                    this.loserName = "BOT"
                    this.winnerCarName = this.normalizeCarType(this.playerCar);
                    this.loserCarName = this.normalizeCarType(this.botCar);
                }
                else{
                    this.winnerName = "BOT";
                    this.loserName = "this.input";
                    this.winnerCarName = this.normalizeCarType(this.botCar);
                    this.loserCarName = this.normalizeCarType(this.playerCar);
                }
                this.loserTime =this.game.loserTime;
                this.winnerTime = this.game.winnerTime;

                /*
                this.winnerCar = new MyVehicleObject("pinkTruck");
                this.winnerCar.position.set(-1960, 230, -3000);
                this.loserCar = new MyVehicleObject("cyanTruck");
                this.loserCar.position.set(-1980, 230, -3000);
                this.app.scene.add(this.winnerCar, this.loserCar);
                this.winnerName = "player";
                this.loserName = "bot";
                this.mode = "normal";
                this.winnerCarName = "Pink Truck";
                this.loserCarName = "Red Truck";
                this.loserTime ="00:00:02";
                this.winnerTime="00:00:01"
                */
                if(this.game){
                    this.game.reset();
                    this.game = null;
                    this.myReader.reset();
                }
                this.game = null;
                this.myReader.reset();

                this.final = new MyFinal(this);

                
                break;
        }
    }

    normalizeCarType(carType){
        if(carType == "pinkTruck") return "Pink Truck"
        else if (carType == "cyanTruck") return "Cyan Truck"
        else if (carType == "orangeTruck") return "Orange Truck"
        else if(carType == "redTruck") return "Red Truck"
        else if (carType == "pinkCar") return "Pink Car"
        else if (carType == "cyanCar") return "Cyan Car"
        else if (carType == "orangeCar") return "Orange Car"
        else if (carType == "redCar") return "Red Car"
    }

    /**
     * Updates the scene
     */
    update() {
        this.myReader.update();
        if (this.previousState != this.state) {
            this.previousState = this.state;
            this.gameStates();

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