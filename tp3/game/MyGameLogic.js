import * as THREE from 'three';
import { MyReader } from './MyReader.js';
import { MyGame } from './MyGame.js';
import { MyMenu } from './MyMenu.js';
import { MyVehicleObject } from './MyVehicleObject.js';
import { MyFinal} from './MyFinal.js';

/**
 *  This class contains all the logic of our game
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

    /**
     * Waits for the reader to load
     */
    waitForReader() {
        if (!this.myReader.backgroundLoaded) {
            setTimeout(this.waitForReader.bind(this), 100);
            return;
        }
        this.state = "menu";
        this.gameStates();
    }

    /**
     * Starts the game
     */
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

    /**
     * Changes the state of the game
     */
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
                this.botCar = (this.botCar == null)? "orangeTrunk" : this.botCar;
                this.playerCar = (this.playerCar ==null)? "pinkTrunk" : this.playerCar;
                this.app.setActiveCamera("final")
                this.winnerCar = this.game.winner.clone();
                this.winnerCar.position.set(-1960, 230, -3000);
                this.loserCar = this.game.loser.clone();
                this.loserCar.position.set(-1980, 230, -3000);
                this.app.scene.add(this.winnerCar, this.loserCar);


                if(this.winnerCar == this.car){
                    this.winnerName = this.menu.input;
                    this.loserName = "BOT"
                    this.winnerCarName = this.normalizeCarType(this.playerCar);
                    this.loserCarName = this.normalizeCarType(this.botCar);
                }
                else{
                    this.winnerName = "BOT";
                    this.loserName = this.menu.input;
                    this.winnerCarName = this.normalizeCarType(this.botCar);
                    this.loserCarName = this.normalizeCarType(this.playerCar);
                }

                this.loserTime = this.formatTime(this.game.loserTime);
                this.winnerTime =  this.formatTime(this.game.winnerTime);
                
                if(this.game){
                    this.game.reset();
                    this.game = null;
                    this.myReader.reset();
                }

                this.game = null;
                this.myReader.reset();

                console.log("oi");
                this.final = new MyFinal(this);

                
                break;
        }
    }

    /**
     * Normalizes the car type
     * @param {*} carType 
     * @returns the car type
     */
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
     * formats the time to mm:ss:ms
     * @param {*} milliseconds 
     * @returns  the time in mm:ss:ms
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const millisecondsPart = Math.floor((milliseconds % 1000) / 10); // Take the first two digits
    
        return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(millisecondsPart)}`;
    }

    /**
     *  Pads a number with a leading zero if it's less than 10
     * @param {Number} number the number to pad 
     * @returns the padded number
     */
     padNumber(number) {
        return number < 10 ? `0${number}` : number.toString();
    }

    /**
     * Updates the gameState
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