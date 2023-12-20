import * as THREE from 'three';

class MyPowerUps {


    constructor(game, position) {
        this.position = position;
        this.game = game;
        this.scale=this.game.scaleTrack;
        //powerups, map of position and type 
        this.powerups1 = [
            {key: new THREE.Vector3(6.5*this.scale, 0, this.scale*13), type: "CUT"},
            {key: new THREE.Vector3(0.3*this.scale, 0, this.scale*15), type: "VELOCITY"},
            {key: new THREE.Vector3(8*this.scale, 0, this.scale*3), type: "VELOCITY"},
            {key: new THREE.Vector3(4.5*this.scale, 0, this.scale*5.5), type: "TIME"},
            {key: new THREE.Vector3(0*this.scale, 0, this.scale*1), type: "CHANGE"},

        ]
        this.powerUpsList = [];

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
                this.game.app.scene.add(cube);
                this.powerUpsList.push(cube);
                break;
            case "CUT":
                let geometry2 = new THREE.BoxGeometry( 4, 4, 4 );
                let material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
                let cube2 = new THREE.Mesh( geometry2, material2 );
                cube2.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube2.position.add(this.position);
                this.game.app.scene.add(cube2);
                this.powerUpsList.push(cube2);
                break;
            case "TIME":
                let geometry3 = new THREE.BoxGeometry( 4, 4, 4 );
                let material3 = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
                let cube3 = new THREE.Mesh( geometry3, material3 );
                cube3.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube3.position.add(this.position);
                this.game.app.scene.add(cube3);
                this.powerUpsList.push(cube3);
                break;
            case "CHANGE":
                let geometry4 = new THREE.BoxGeometry( 4, 4, 4 );
                let material4 = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
                let cube4 = new THREE.Mesh( geometry4, material4 );
                cube4.position.set(powerUps.key.x, powerUps.key.y, powerUps.key.z);
                cube4.position.add(this.position);
                this.game.app.scene.add(cube4);
                this.powerUpsList.push(cube4);
                break;
            default:
                break;
        }
    }

    getPowerUps(){
        return this.powerUpsList;
    }



}

export { MyPowerUps };