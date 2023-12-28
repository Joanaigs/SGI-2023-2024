import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyDisplay extends THREE.Object3D {


    constructor(game, position) {
        super();
        this.game = game;
        this.time = 0;
        this.laps = 0;
        this.velocity = 0;
        this.timeObstacle = 0;
        this.timePowerUp = 0;
        this.pause = false;
        this.buildDisplay();
        
    }

    buildDisplay() {
        let i=this.game.scale;
        let material = new THREE.SpriteMaterial( {color: 0x00ff00} );
        let cube = new THREE.Sprite(  material );
        cube.scale.set(50, 30, 50);
        cube.position.set(50,25,300);

        this.add(cube);
    }





    

    
}

export { MyDisplay };