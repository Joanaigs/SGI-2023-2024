import * as THREE from 'three';

class MyObstacle {


    constructor(game, position) {
        this.position = position;
        this.game = game;
        this.scale=this.game.scaleTrack;
        //obstacles, map of position and type 
        this.obstacle1 = [
            {key: new THREE.Vector3(5*this.scale, 0, this.scale*4.5), type: "CONFUSED"},
            {key: new THREE.Vector3(3*this.scale, 0, this.scale*14), type: "VELOCITY"},
            {key: new THREE.Vector3(1*this.scale, 0, this.scale*0), type: "SLIPPERY"},

        ]
        this.obstaclesList = [];

    }

    drawObstacles(value) {
        console.log("drawObstacles");
        if (value === 1) {
            this.obstacles=this.obstacle1;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
           this.drawObstacle(this.obstacles[i]);
        }
    }

    drawObstacle(obstacle){
        switch (obstacle.type) {
            case "VELOCITY":
                console.log("velocity");
                let geometry = new THREE.BoxGeometry( 4, 4, 4 );
                let material = new THREE.MeshBasicMaterial( {color: 0xf0ff00} );
                let cube = new THREE.Mesh( geometry, material );
                cube.position.set(obstacle.key.x, obstacle.key.y, obstacle.key.z);
                cube.position.add(this.position);
                this.game.app.scene.add(cube);
                this.obstaclesList.push(cube);
                break;
            case "CONFUSED":
                let geometry2 = new THREE.BoxGeometry( 4, 4, 4 );
                let material2 = new THREE.MeshBasicMaterial( {color: 0xff0f0f} );
                let cube2 = new THREE.Mesh( geometry2, material2 );
                cube2.position.set(obstacle.key.x, obstacle.key.y, obstacle.key.z);
                cube2.position.add(this.position);
                this.game.app.scene.add(cube2);
                this.obstaclesList.push(cube2);
                break;
            case "SLIPPERY":
                let geometry3 = new THREE.BoxGeometry( 4, 4, 4 );
                let material3 = new THREE.MeshBasicMaterial( {color: 0x30f33f} );
                let cube3 = new THREE.Mesh( geometry3, material3 );
                cube3.position.set(obstacle.key.x, obstacle.key.y, obstacle.key.z);
                cube3.position.add(this.position);
                this.game.app.scene.add(cube3);
                this.obstaclesList.push(cube3);
                break;
        }
    }

    getObstacles(){
        return this.obstaclesList;
    }

}

export { MyObstacle };