import * as THREE from 'three';

class MyPowerUps {


    constructor(app, position, scale) {
        this.position = position;
        this.app = app;
        this.scale=scale;
        //powerups, map of position and type 
        this.powerups1 = [
            {key: new THREE.Vector3(6.5*this.scale, 0, this.scale*13.5), type: "CUT"},
            {key: new THREE.Vector3(0.3*this.scale, 0, this.scale*15), type: "VELOCITY"},
            {key: new THREE.Vector3(8*this.scale, 0, this.scale*3), type: "VELOCITY"},
            {key: new THREE.Vector3(4.5*this.scale, 0, this.scale*5.5), type: "TIME"},
            {key: new THREE.Vector3(0*this.scale, 0, this.scale*1), type: "CHANGE"},

        ]
        this.powerUpsObject = new Map();

    }

    drawPowerUps(value) {
        if (value === 1) {
            this.powerups=this.powerups1;
        }
        for (let i = 0; i < this.powerups.length; i++) {
           this.drawPowerUp(this.powerups[i]);
        }
    }

    drawPowerUp(powerUps){
        switch (powerUps.type) {
            case "VELOCITY":
                let geometry = new THREE.BoxGeometry( 4, 4, 4 );
                let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
                let cube = new THREE.Mesh( geometry, material );
                cube.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube.position.add(this.position);
                this.app.scene.add(cube);
                this.powerUpsObject.set(cube, powerUps.type);
                break;
            case "CUT":
                let geometry2 = new THREE.BoxGeometry( 4, 4, 4 );
                let material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
                let cube2 = new THREE.Mesh( geometry2, material2 );
                cube2.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube2.position.add(this.position);
                this.app.scene.add(cube2);
                this.powerUpsObject.set(cube2, powerUps.type);
                break;
            case "TIME":
                let geometry3 = new THREE.BoxGeometry( 4, 4, 4 );
                let material3 = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
                let cube3 = new THREE.Mesh( geometry3, material3 );
                cube3.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube3.position.add(this.position);
                this.app.scene.add(cube3);
                this.powerUpsObject.set(cube3, powerUps.type);
                break;
            case "CHANGE":
                let geometry4 = new THREE.BoxGeometry( 4, 4, 4 );
                let material4 = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
                let cube4 = new THREE.Mesh( geometry4, material4 );
                cube4.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube4.position.add(this.position);
                this.app.scene.add(cube4);
                this.powerUpsObject.set(cube4, powerUps.type);
                break;
            default:
                break;
        }
    }

    velocityPowerUp() {
        const originalMaxVelocity = this.game.car.maxVelocity;
    
        // Increase velocity and maxVelocity
        this.game.car.velocity += 0.5;
        this.game.car.maxVelocity += 0.5;
    
        // Set a timeout to revert the changes after 10 seconds
        setTimeout(() => {
            this.game.car.maxVelocity = originalMaxVelocity;
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    velocityCutPowerUp(){
        this.game.cutPath.visible = true;
        setTimeout(() => {
            this.game.cutPath.visible = false;
        }, 5000); 
    }

    timePowerUp(){
        this.game.penalties -= 1;
        console.log(this.game.penalties);
    }

    activatePowerUp(game, object){
        this.game = game;
        let powerUp = this.powerUpsObject.get(object);
        console.log(powerUp);
        switch (powerUp) {
            case "VELOCITY":
                console.log("velocity");
                this.velocityPowerUp();
                break;
            case "CUT":
                this.velocityCutPowerUp();
                break;
            case "TIME":
                this.timePowerUp();
                break;
            case "CHANGE":
                this.changePowerUp();
                break;
            default:
                break;
        }
    }

    getPowerUps(){
        //list of keys
        let keys = Array.from(this.powerUpsObject.keys());
        return keys;
    }



}

export { MyPowerUps };