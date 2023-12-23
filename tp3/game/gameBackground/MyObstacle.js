import * as THREE from 'three';

class MyObstacle {


    constructor(app, position, scale) {
        this.position = position;
        this.app = app;
        this.scale=scale;
        //obstacles, map of position and type 
        this.obstacle1 = [
            {key: new THREE.Vector3(5*this.scale, 0, this.scale*4.5), type: "CONFUSED"},
            {key: new THREE.Vector3(3*this.scale, 0, this.scale*14), type: "VELOCITY"},
            {key: new THREE.Vector3(1*this.scale, 0, this.scale*0), type: "SLIPPERY"},
        ]
        this.obstacleAvailable1 = [
            {key: new THREE.Vector3(3*this.scale, 0, this.scale*8), type: "CONFUSED"},
            {key: new THREE.Vector3(3.5*this.scale, 0, this.scale*8), type: "VELOCITY"},
            {key: new THREE.Vector3(4*this.scale, 0, this.scale*8), type: "SLIPPERY"},
        ]
        this.obstaclesObject = new Map();
        this.obstaclesAvailableObject = new Map();


    }

    addObstacle(obstacle){
        console.log("addObstacle");
        this.obstaclesObject.set(obstacle, obstacle.name);
    }

    drawObstaclesPark(value) {
        if(value===1){
            for (let i = 0; i < this.obstacleAvailable1.length; i++) {
                let obstacle = this.drawObstacle(this.obstacleAvailable1[i], false);
                this.obstaclesAvailableObject.set(obstacle, this.obstacleAvailable1[i].type);
            }
        }
    }

    drawObstacles(value) {
        console.log("drawObstacles");
        if (value === 1) {
            this.obstacles=this.obstacle1;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.drawObstacle(this.obstacles[i]);
            this.obstaclesObject.set(obstacle, this.obstacles[i].type);
        }
    }

    drawObstacle(obstacle, visible=true){
        switch (obstacle.type) {
            case "VELOCITY":
                console.log("velocity");
                let geometry = new THREE.BoxGeometry( 4, 4, 4 );
                let material = new THREE.MeshBasicMaterial( {color: 0xf0ff00} );
                let cube = new THREE.Mesh( geometry, material );
                cube.position.set(obstacle.key.x, obstacle.key.y, obstacle.key.z);
                cube.position.add(this.position);
                cube.name="VELOCITY";
                cube.visible=visible;
                this.app.scene.add(cube);
                return cube;
            case "CONFUSED":
                let geometry2 = new THREE.BoxGeometry( 4, 4, 4 );
                let material2 = new THREE.MeshBasicMaterial( {color: 0xff0f0f} );
                let cube2 = new THREE.Mesh( geometry2, material2 );
                cube2.position.set(obstacle.key.x, obstacle.key.y, obstacle.key.z);
                cube2.position.add(this.position);
                cube2.name="CONFUSED";
                cube2.visible=visible;
                this.app.scene.add(cube2);
                return cube2;
            case "SLIPPERY":
                let geometry3 = new THREE.BoxGeometry( 4, 4, 4 );
                let material3 = new THREE.MeshBasicMaterial( {color: 0x30f33f} );
                let cube3 = new THREE.Mesh( geometry3, material3 );
                cube3.position.set(obstacle.key.x, obstacle.key.y, obstacle.key.z);
                cube3.position.add(this.position);
                cube3.name="SLIPPERY";
                cube3.visible=visible;
                this.app.scene.add(cube3);
                return cube3;
        }
    }

    obstacleVelocity(){
        const originalMaxVelocity = this.game.car.maxVelocity;
        const originalVelocity = this.game.car.velocity;
    
        // Increase velocity and maxVelocity
        this.game.car.velocity -= 0.5;
        this.game.car.maxVelocity -= 0.5;
        console.log(this.game.car.velocity);
    
        // Set a timeout to revert the changes after 10 seconds
        setTimeout(() => {
            this.game.car.maxVelocity = originalMaxVelocity;
            this.game.car.velocity = originalVelocity;
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    obstacleConfused(){
        this.game.car.confused = true;
        setTimeout(() => {
            this.game.car.confused = false;
        }, 10000); // 10000 milliseconds = 10 seconds

    }

    obstacleSlippery(){
        const originalRotationScale = this.game.car.rotationScale;

        // Increase rotationScale
        this.game.car.rotateScale += 0.5;
        console.log(this.game.car.rotateScale);

        setTimeout(() => {
            this.game.car.rotationScale = originalRotationScale;
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    activateObstacle(game, object){
        this.game = game;
        let obstacle = this.obstaclesObject.get(object);
        console.log(obstacle);
        switch (obstacle) {
            case "VELOCITY":
                this.obstacleVelocity();
                break;
            case "CONFUSED":
                this.obstacleConfused();
                break;
            case "SLIPPERY":
                this.obstacleSlippery();
                break;
        }
    }

    getObstacles(){
        let keys = Array.from(this.obstaclesObject.keys());
        return keys;
    }

    getObstaclesAvailable(){
        let keys = Array.from(this.obstaclesAvailableObject.keys());
        return keys;
    }

    reset(){
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstaclesObject.get(this.obstacles[i]);
            this.app.scene.remove(obstacle);
        }
        this.obstaclesObject.clear();
        this.obstaclesAvailableObject.clear();
    }

}

export { MyObstacle };